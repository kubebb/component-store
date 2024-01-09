import serverConfig from '@/config/server.config';
import * as k8s from '@kubernetes/client-node';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { readFileSync } from 'fs';
import { IS_PROD, K8S_SA_TOKEN_PATH } from 'src/common/utils';
import * as lib from './lib/';
import { ClientOptions } from './lib/interfaces';

interface K8sUser extends k8s.User {
  ip?: string;
}

const k8sApiTimeout = process.env.K8S_API_TIMEOUT || '12';
const defaultInterceptor: k8s.Interceptor = requestOptions => {
  requestOptions.timeout = parseFloat(k8sApiTimeout) * 1000;
};

type KubernetesClientBase = Awaited<ReturnType<KubernetesService['getClientBase']>>;
export interface KubernetesClient extends KubernetesClientBase {
  /** _bff 下的资源会使用 bff-server 自己的 service account 来作为调用 k8s api 的凭证，且只能操作管理集群的资源*/
  _bff?: Awaited<KubernetesClientBase>;
}

@Injectable()
export class KubernetesService {
  constructor(
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}

  private logger = new Logger('KubernetesService');

  createKubeConfig(cluster: k8s.Cluster, user: k8s.User) {
    const kubeConfig = new k8s.KubeConfig();
    kubeConfig.loadFromClusterAndUser(cluster, user);
    return kubeConfig;
  }

  private async getCluster(user: K8sUser, name: string) {
    const k8s = await this.getClient(user);
    const { body: cluster } = await k8s.cluster.read(name);
    const server = cluster.spec.apiEndpoint;
    return {
      name,
      server,
      skipTLSVerify: true,
    };
  }

  /**
   * 获取 k8s client
   *
   * @param user 用户认证信息
   * @param options 可选项，可以配置 cluster 和 interceptor
   * - 当指定的 `options.cluster` 为集群 name 时，会根据 name 获取到集群的 api 地址生成对应的 client
   * - 当指定的 `options.cluster` 为集群对象时，则直接根据集群对象返回对应的 client
   * - 当指定 `options.interceptor` 拦截器时，会把拦截器作用在每个 api 中，可以在拦截器里更改 request 的选项
   * - 当指定 `options._bff` 为 true 时，会增加 `_bff`属性，_bff 下的资源会使用 bff-server 自己的 service account 来作为调用 k8s api 的凭证，且返回的 client 是管理集群的，不支持指定集群
   */
  async getClient(user: K8sUser, options: ClientOptions = {}): Promise<KubernetesClient> {
    const client = await this.getClientBase(user, options);
    if (!options._bff) {
      return client;
    }
    if (IS_PROD) {
      try {
        this.config.k8s.bffSaToken = readFileSync(K8S_SA_TOKEN_PATH).toString();
      } catch (error) {
        this.logger.error('read service account token failed', error);
      }
    }
    const bffClient = await this.getClientBase(
      { name: 'bff-sa', token: this.config.k8s.bffSaToken, ip: user.ip },
      // 只支持管理集群，不支持指定其他集群
      { ...options, cluster: undefined }
    );
    return {
      ...client,
      _bff: bffClient,
    };
  }

  async logClient(user: k8s.User) {
    const cluster = this.config.k8s.cluster;
    const kc = new k8s.KubeConfig();
    kc.loadFromClusterAndUser(cluster, user);
    return new k8s.Log(kc);
  }

  private async getClientBase(user: K8sUser, options: ClientOptions = {}) {
    const { cluster: specifiedCluster, interceptor = defaultInterceptor } = options;
    const defaultHeadersInterceptor: k8s.Interceptor = requestOptions => {
      if (user.ip) {
        requestOptions.headers['X-Forwarded-For'] = user.ip;
      }
    };
    let cluster = this.config.k8s.cluster;
    if (typeof specifiedCluster === 'string') {
      cluster = await this.getCluster(user, specifiedCluster);
    } else if (specifiedCluster?.server) {
      cluster = specifiedCluster;
    }

    const kubeConfig = this.createKubeConfig(cluster, user);

    const coreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api);
    coreV1Api.addInterceptor(defaultHeadersInterceptor);
    coreV1Api.addInterceptor(interceptor);

    const customObjectsApi = kubeConfig.makeApiClient(k8s.CustomObjectsApi);
    customObjectsApi.addInterceptor(defaultHeadersInterceptor);
    customObjectsApi.addInterceptor(interceptor);

    const rbacAuthorizationV1Api = kubeConfig.makeApiClient(k8s.RbacAuthorizationV1Api);
    rbacAuthorizationV1Api.addInterceptor(defaultHeadersInterceptor);
    rbacAuthorizationV1Api.addInterceptor(interceptor);

    const appsV1Api = kubeConfig.makeApiClient(k8s.AppsV1Api);
    appsV1Api.addInterceptor(defaultHeadersInterceptor);
    appsV1Api.addInterceptor(interceptor);

    const batchV1Api = kubeConfig.makeApiClient(k8s.BatchV1Api);
    batchV1Api.addInterceptor(defaultHeadersInterceptor);
    batchV1Api.addInterceptor(interceptor);

    const authorizationV1Api = kubeConfig.makeApiClient(k8s.AuthorizationV1Api);
    authorizationV1Api.addInterceptor(defaultHeadersInterceptor);
    authorizationV1Api.addInterceptor(interceptor);

    const authenticationV1Api = kubeConfig.makeApiClient(k8s.AuthenticationV1Api);
    authenticationV1Api.addInterceptor(defaultHeadersInterceptor);
    authenticationV1Api.addInterceptor(interceptor);

    return {
      // ~ apis
      coreV1Api,
      customObjectsApi,
      rbacAuthorizationV1Api,
      appsV1Api,
      batchV1Api,
      authorizationV1Api,
      authenticationV1Api,
      // ~ core
      // <replace type="core">
      pod: new lib.Pod(coreV1Api),
      node: new lib.Node(coreV1Api),
      configMap: new lib.ConfigMap(coreV1Api),
      endpoints: new lib.Endpoints(coreV1Api),
      event: new lib.Event(coreV1Api),
      limitRange: new lib.LimitRange(coreV1Api),
      namespace: new lib.Namespace(coreV1Api),
      persistentVolumeClaim: new lib.PersistentVolumeClaim(coreV1Api),
      persistentVolume: new lib.PersistentVolume(coreV1Api),
      podTemplate: new lib.PodTemplate(coreV1Api),
      replicationController: new lib.ReplicationController(coreV1Api),
      resourceQuota: new lib.ResourceQuota(coreV1Api),
      secret: new lib.Secret(coreV1Api),
      serviceAccount: new lib.ServiceAccount(coreV1Api),
      service: new lib.Service(coreV1Api),
      // </replace type="core">
      // ~ crd
      // <replace type="crd">
      application: new lib.Application(customObjectsApi),
      cluster: new lib.Cluster(customObjectsApi),
      componentplan: new lib.ComponentPlan(customObjectsApi),
      component: new lib.Component(customObjectsApi),
      menu: new lib.Menu(customObjectsApi),
      pipeline: new lib.Pipeline(customObjectsApi),
      prompt: new lib.Prompt(customObjectsApi),
      rating: new lib.Rating(customObjectsApi),
      repository: new lib.Repository(customObjectsApi),
      subscription: new lib.Subscription(customObjectsApi),
      user: new lib.User(customObjectsApi),
      // </replace type="crd">
      // ~ rbac
      // <replace type="rbac">
      clusterRoleBinding: new lib.ClusterRoleBinding(rbacAuthorizationV1Api),
      clusterRole: new lib.ClusterRole(rbacAuthorizationV1Api),
      roleBinding: new lib.RoleBinding(rbacAuthorizationV1Api),
      role: new lib.Role(rbacAuthorizationV1Api),
      // </replace type="rbac">
      // ~ apps
      // <replace type="apps">
      controllerRevision: new lib.ControllerRevision(appsV1Api),
      daemonSet: new lib.DaemonSet(appsV1Api),
      deployment: new lib.Deployment(appsV1Api),
      replicaSet: new lib.ReplicaSet(appsV1Api),
      statefulSet: new lib.StatefulSet(appsV1Api),
      // </replace type="apps">
      // ~ batch
      // <replace type="batch">
      cronJob: new lib.CronJob(batchV1Api),
      job: new lib.Job(batchV1Api),
      // </replace type="batch">
    };
  }
}
