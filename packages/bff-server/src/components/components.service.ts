import { SortDirection } from '@/common/models/sort-direction.enum';
import { decodeBase64, __ALL__, __OTHER__ } from '@/common/utils';
import serverConfig from '@/config/server.config';
import { ConfigmapService } from '@/configmap/configmap.service';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { RepositoryService } from '@/repository/repository.service';
import { Secret } from '@/secret/models/secret.model';
import { SecretService } from '@/secret/secret.service';
import { CRD, JwtAuth, UrllibClientOptions } from '@/types';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { IncomingHttpHeaders } from 'http';
import * as urllib from 'urllib';
import { RequestOptions } from 'urllib';
import { ComponentArgs } from './dto/component.args';
import { CreateComponentInput } from './dto/create-component.input';
import { DeleteComponentInput } from './dto/delete-component.input';
import { DownloadComponentInput } from './dto/download-component.input';
import { Component, ComponentChart, PaginatedComponent } from './models/component.model';

@Injectable()
export class ComponentsService {
  constructor(
    private readonly k8sService: KubernetesService,
    private readonly repositoryService: RepositoryService,
    private readonly secretService: SecretService,
    private readonly configmapService: ConfigmapService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}

  private logger = new Logger('ComponentsService');
  private kubebbNS = this.config.kubebb.namespace;

  formatComponent(c: CRD.Component, cluster?: string): Component {
    const latestVersion = c.status?.versions?.[0];
    const restrictedTenants =
      latestVersion?.annotations?.['core.kubebb.k8s.com.cn/restricted-tenants'];
    const restrictedNamespaces =
      latestVersion?.annotations?.['core.kubebb.k8s.com.cn/restricted-namespaces'];
    const classification = latestVersion?.annotations?.['core.kubebb.k8s.com.cn/classification'];
    const isNewer = latestVersion?.createdAt
      ? Date.now() - 7 * 24 * 60 * 60 * 1000 < new Date(latestVersion.createdAt).valueOf()
      : false;
    return {
      name: c.metadata?.name,
      namespace: c.metadata?.namespace,
      namespacedName: `${c.metadata?.name}_${c.metadata.namespace}_${cluster || ''}`,
      displayName: c.status?.displayName,
      chartName: c.status?.name,
      repository: c.status?.repository?.name,
      description: c.status?.description,
      deprecated: c.status?.deprecated,
      icon: c.status?.icon,
      keywords: c.status?.keywords,
      home: c.status?.home,
      sources: c.status?.sources,
      versions: c.status?.versions,
      maintainers: c.status?.maintainers,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
      updatedAt: latestVersion?.updatedAt ? new Date(latestVersion?.updatedAt).toISOString() : null,
      latestVersion: latestVersion?.version,
      restrictedTenants: restrictedTenants ? restrictedTenants.split(',') : null,
      restrictedNamespaces: restrictedNamespaces ? restrictedNamespaces.split(',') : null,
      classification,
      isNewer,
    };
  }

  async list(auth: JwtAuth, cluster?: string): Promise<Component[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.component.list(this.kubebbNS);
    return body.items?.map(t => this.formatComponent(t, cluster));
  }

  async listComponents(auth: JwtAuth, cluster?: string): Promise<Component[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.component.list(this.kubebbNS);
    return body.items
      ?.filter(t => !t.status?.deprecated)
      ?.map(t => this.formatComponent(t))
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }

  async getComponentsPaged(auth: JwtAuth, args: ComponentArgs): Promise<PaginatedComponent> {
    const {
      page,
      pageSize,
      name,
      chartName,
      keyword,
      sortDirection,
      sortField,
      cluster,
      source,
      isNewer,
      repository,
      classification,
    } = args;
    let reposName: string[] = [];
    if (source) {
      const repos = await this.repositoryService.getRepositories(auth, { source }, cluster);
      reposName = repos?.map(r => r.name);
    }
    const res = await this.listComponents(auth, cluster);
    const filteredRes = res?.filter(
      t =>
        (!name || t.name?.includes(name)) &&
        (!chartName || t.chartName?.includes(chartName) || t.displayName?.includes(chartName)) &&
        (!keyword || t.keywords?.includes(keyword)) &&
        (!source || reposName.includes(t.repository)) &&
        (!repository || t.repository?.includes(repository)) &&
        (isNewer === undefined || t.isNewer === isNewer) &&
        (!classification ||
          t.classification === classification ||
          (classification === __OTHER__ && !t.classification) ||
          classification === __ALL__)
    );
    if (sortField && sortDirection) {
      filteredRes?.sort((a, b) => {
        if (sortField === 'updatedAt') {
          const [aT, bT] = [new Date(a.updatedAt).valueOf(), new Date(b.updatedAt).valueOf()];
          return sortDirection === SortDirection.ascend ? aT - bT : bT - aT;
        }
      });
    }
    const totalCount = filteredRes.length;
    return {
      totalCount,
      hasNextPage: page * pageSize < totalCount,
      nodes: filteredRes.slice((page - 1) * pageSize, page * pageSize),
    };
  }

  async getComponent(auth: JwtAuth, name: string, cluster?: string): Promise<Component> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.component.read(name, this.kubebbNS);
    return this.formatComponent(body);
  }

  /**
   * 通过「POST /api/charts - upload a new chart version」创建 Component
   * 参考 https://github.com/helm/chartmuseum
   */
  async uploadChart(
    auth: JwtAuth,
    chart: CreateComponentInput,
    cluster?: string
  ): Promise<boolean> {
    const { repository, file } = chart;
    const { createReadStream } = await file;
    const { url, authSecret } = await this.repositoryService.getRepository(
      auth,
      repository,
      cluster
    );
    let secret: Secret;
    if (authSecret) {
      secret = await this.secretService.getSecretDetail(auth, authSecret, this.kubebbNS, cluster);
    }
    await this.callChartMuseumClient(
      `${url}/api/charts`,
      {
        method: 'POST',
        content: createReadStream(),
      },
      secret
    );
    await this.repositoryService.syncRepository(auth, repository, cluster);
    return true;
  }

  /**
   * 通过「DELETE /api/charts/<name>/<version> - delete a chart version (and corresponding provenance file)」删除 Component
   */
  async deleteChart(
    auth: JwtAuth,
    chart: DeleteComponentInput,
    cluster?: string
  ): Promise<boolean> {
    const { repository, chartName, versions } = chart;
    const { url, authSecret } = await this.repositoryService.getRepository(
      auth,
      repository,
      cluster
    );
    let secret: Secret;
    if (authSecret) {
      secret = await this.secretService.getSecretDetail(auth, authSecret, this.kubebbNS, cluster);
    }
    await Promise.all(
      versions?.map(version =>
        this.callChartMuseumClient(
          `${url}/api/charts/${chartName}/${version}`,
          {
            method: 'DELETE',
          },
          secret
        )
      )
    );
    await this.repositoryService.syncRepository(auth, repository, cluster);
    return true;
  }

  async downloadChart(
    auth: JwtAuth,
    chart: DownloadComponentInput,
    cluster?: string
  ): Promise<string> {
    const { repository, chartName, version } = chart;
    const { url } = await this.repositoryService.getRepository(auth, repository, cluster);
    return `${url}/charts/${chartName}-${version}.tgz`;
  }

  async callChartMuseum(endpoint: string, options?: RequestOptions) {
    const headers: IncomingHttpHeaders = {};
    const reqUrl = endpoint;
    Logger.debug('callChartMuseum => url:', reqUrl);
    Logger.debug('callChartMuseum => options:', options);
    const defaultOptions: RequestOptions = {
      dataType: 'json',
      timeout: 10 * 1000,
      headers,
    };
    const res = await urllib.request(reqUrl, Object.assign({}, defaultOptions, options));
    if (res.status >= 400) {
      throw new HttpException(res, res.status);
    }
    return res;
  }

  async callChartMuseumClient(endpoint: string, options: RequestOptions, secret?: Secret) {
    const reqUrl = endpoint;
    const cOptions: UrllibClientOptions = {
      defaultArgs: {
        dataType: 'json',
        timeout: 10 * 1000,
      },
      connect: {},
    };
    if (secret) {
      if (secret?.data?.password && secret?.data?.username) {
        options.auth = `${decodeBase64(secret.data.username)}:${decodeBase64(
          secret.data.password
        )}`;
      }
      if (secret?.data?.certdata) {
        cOptions.connect.cert = decodeBase64(secret.data.certdata);
      }
      if (secret?.data?.keydata) {
        cOptions.connect.key = decodeBase64(secret.data.keydata);
      }
      if (secret?.data?.cadata) {
        cOptions.connect.ca = decodeBase64(secret.data.cadata);
      }
    }
    Logger.debug('callChartMuseum => url:', reqUrl);
    Logger.debug('callChartMuseum => options:', cOptions);
    const urllibClient = new urllib.HttpClient(cOptions);
    const res = await urllibClient.request(reqUrl, options);
    if (res.status >= 400) {
      throw new HttpException(res, res.status);
    }
    return res;
  }

  async getChartValues(
    auth: JwtAuth,
    name: string,
    namespace: string,
    version: string,
    cluster?: string
  ): Promise<ComponentChart> {
    const { data } = await this.configmapService.getConfigmap(
      auth,
      `${name}-${version}`,
      namespace,
      cluster
    );
    const images = data?.images?.split(',');
    const imagesFaked = images?.map(img => {
      const parts = img?.split(':');
      const aParts = parts?.[0]?.split('/');
      const len = aParts?.length;
      return {
        image: img,
        id: parts?.[0],
        name: aParts[len - 1],
        path: aParts[len - 2],
        registry: aParts?.[len - 3] ? aParts[len - 3] : 'docker.io',
        tag: parts?.[1],
      };
    });
    return {
      images,
      imagesFaked,
      valuesYaml: data?.['values.yaml'],
      readme: data?.readme,
    };
  }
}
