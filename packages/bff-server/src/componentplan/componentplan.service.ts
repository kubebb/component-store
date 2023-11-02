import { SortDirection } from '@/common/models/sort-direction.enum';
import { genContentHash, genNanoid } from '@/common/utils';
import { ComponentsService } from '@/components/components.service';
import { Component } from '@/components/models/component.model';
import serverConfig from '@/config/server.config';
import { ConfigmapService } from '@/configmap/configmap.service';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { InstallMethod } from '@/subscription/models/installmethod.enum';
import { Subscription } from '@/subscription/models/subscription.model';
import { SubscriptionService } from '@/subscription/subscription.service';
import { CRD, JwtAuth, ListOptions } from '@/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ComponentplanArgs } from './dto/componentplan.args';
import { CreateComponentplanInput } from './dto/create-componentplan.input';
import { UpdateComponentplanInput } from './dto/update-componentplan.input';
import { Componentplan, PaginatedComponentplan } from './models/componentplan.model';
import { ExportComponentplanStatus } from './models/export-status-componentplan.enum';
import { ComponentplanStatus } from './models/status-componentplan.enum';

@Injectable()
export class ComponentplanService {
  constructor(
    private readonly k8sService: KubernetesService,
    private readonly componentsService: ComponentsService,
    private readonly subscriptionService: SubscriptionService,
    private readonly configmapService: ConfigmapService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}

  private logger = new Logger('ComponentplanService');
  private kubebbNS = this.config.kubebb.namespace;

  format(cp: CRD.ComponentPlan, component?: Component): Componentplan {
    let status = ExportComponentplanStatus.Unknown;
    let reason: string;
    const conditions = cp.status?.conditions;
    if (conditions) {
      const succeeded = conditions.find(c => c.type === 'Succeeded');
      const actioned = conditions.find(c => c.type === 'Actioned');
      if (succeeded?.status === 'False') {
        if (actioned.reason === ComponentplanStatus.UninstallFailed) {
          status = ExportComponentplanStatus.UninstallFailed;
          reason = actioned.message;
        } else if (actioned.reason === ComponentplanStatus.Uninstalling) {
          status = ExportComponentplanStatus.Uninstalling;
        } else if (
          actioned.reason === ComponentplanStatus.Installing ||
          actioned.reason === ComponentplanStatus.WaitDo
        ) {
          if (actioned.message) {
            status = ExportComponentplanStatus.InstallFailed;
            reason = actioned.message;
          } else {
            status = ExportComponentplanStatus.Installing;
          }
        } else {
          status = ExportComponentplanStatus.InstallFailed;
          reason = actioned.message;
        }
      }
      if (succeeded?.status === 'True') {
        status = ExportComponentplanStatus.InstallSuccess;
      }
    }

    return {
      name: cp.metadata?.name,
      creationTimestamp: new Date(cp.metadata?.creationTimestamp).toISOString(),
      namespace: cp.metadata?.namespace,
      componentName: cp.spec?.component?.name,
      component,
      version: cp.spec?.version,
      releaseName: cp.spec?.name,
      subscriptionName: cp.metadata?.labels?.['core.kubebb.k8s.com.cn/subscription-name'],
      approved: cp.spec?.approved,
      status,
      reason,
      latest: cp.status?.latest,
      images: cp.spec?.override?.images,
      configmap: cp.spec?.override?.valuesFrom?.filter(v => v.kind === 'ConfigMap')?.[0]?.name,
    };
  }

  async list(
    auth: JwtAuth,
    namespace: string,
    options: ListOptions = {},
    cluster?: string
  ): Promise<Componentplan[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.list(namespace, options);
    const components = await this.componentsService.listComponents(auth, cluster);
    return body.items
      ?.map(t => {
        const specComponent = t.spec?.component;
        const component = components?.find(c => c.name === specComponent?.name);
        return this.format(t, component);
      })
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }

  async get(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<Componentplan> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.read(name, namespace);
    let cm: Component;
    if (body?.spec?.component?.name) {
      try {
        cm = await this.componentsService.getComponent(auth, body.spec.component.name, cluster);
      } catch (err) {}
    }
    return this.format(body, cm);
  }

  async listPaged(auth: JwtAuth, args: ComponentplanArgs): Promise<PaginatedComponentplan> {
    const {
      page = 1,
      pageSize = 20,
      releaseName,
      sortDirection,
      sortField,
      cluster,
      namespace,
      chartName,
      repository,
      status,
      isNewer,
    } = args;
    const res = await this.list(auth, namespace, {}, cluster);
    // 过滤出 以releaseName为唯一ID，选择cpl status.latest == true（其中sub创建的cpl（status.latest == null）手动，通过「组件市场」安装入口安装）
    const releasenameMap = new Map();
    const latestMap = new Map();
    res?.forEach(cpl => {
      if (cpl.releaseName) {
        const current = releasenameMap.get(cpl.releaseName);
        if (
          !current ||
          new Date(current.created).valueOf() < new Date(cpl.creationTimestamp).valueOf()
        ) {
          releasenameMap.set(cpl.releaseName, {
            name: cpl.name,
            created: cpl.creationTimestamp,
            reason: cpl.reason,
          });
        }
        if (cpl.latest === true) {
          latestMap.set(cpl.releaseName, { name: cpl.name });
        }
      }
    });
    const fRes = res?.filter(
      t =>
        t.latest === true ||
        (releasenameMap.get(t.releaseName)?.name === t.name &&
          t.approved === true &&
          !latestMap.has(t.releaseName))
    );
    // 对应的场景：第一次安装成功，后再次操作更新失败，则显示「安装成功」，同时提示更新失败的原因
    fRes.forEach(f => {
      const curF = releasenameMap.get(f.releaseName);
      if (curF && curF.name !== f.name && curF.reason) {
        f.reason = `Update: ${curF.reason},However,the current component can be used normally`;
      }
    });
    // 根据搜索条件过滤
    const filteredRes = fRes?.filter(
      t =>
        (!releaseName || t.releaseName?.includes(releaseName)) &&
        (!chartName || t.component?.chartName?.includes(chartName)) &&
        (!repository || t.component?.repository?.includes(repository)) &&
        (!status || status?.includes(t.status)) &&
        (isNewer === undefined || t.component?.isNewer === isNewer)
    );
    if (sortField && sortDirection) {
      filteredRes?.sort((a, b) => {
        if (sortField === 'creationTimestamp') {
          const [aT, bT] = [
            new Date(a.creationTimestamp).valueOf(),
            new Date(b.creationTimestamp).valueOf(),
          ];
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

  async history(
    auth: JwtAuth,
    namespace: string,
    releaseName: string,
    cluster?: string
  ): Promise<Componentplan[]> {
    const labelSelectors = [`core.kubebb.k8s.com.cn/componentplan-release=${releaseName}`];
    const cpls = await this.list(
      auth,
      namespace,
      { labelSelector: labelSelectors.join(',') },
      cluster
    );
    const versionMap = new Map();
    cpls?.forEach(cpl => {
      if (cpl.version) {
        const num = versionMap.get(cpl.version) || 0;
        const cTime =
          new Date(cpl.creationTimestamp).valueOf() > new Date(num).valueOf()
            ? cpl.creationTimestamp
            : num;
        versionMap.set(cpl.version, cTime);
      }
    });
    const filteredRes = cpls?.filter(
      t => versionMap.has(t.version) && versionMap.get(t.version) === t.creationTimestamp
    );
    return filteredRes;
  }

  async create(
    auth: JwtAuth,
    namespace: string,
    componentplan: CreateComponentplanInput & { configmap?: string },
    cluster?: string
  ): Promise<boolean> {
    /**
     * 创建：
     * 1. 自动：只创建sub
     * 2. 手动：创建cpl
     */
    const {
      releaseName,
      chartName,
      repository,
      version,
      componentPlanInstallMethod,
      valuesYaml,
      images,
      configmap,
    } = componentplan;
    let valuesFrom: any[];
    if (valuesYaml) {
      const cmName = await this.disposeValuesYaml(
        auth,
        namespace,
        { repository, chartName, version, releaseName, valuesYaml, configmap },
        cluster
      );
      if (cmName) {
        valuesFrom = [
          {
            kind: 'ConfigMap',
            name: cmName,
          },
        ];
      }
    }
    if (componentPlanInstallMethod === InstallMethod.auto) {
      await this.subscriptionService.createSubscriptionByCpl(
        auth,
        namespace,
        componentplan,
        valuesFrom,
        cluster
      );
      return true;
    }
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.componentplan.create(namespace, {
      metadata: {
        name: genNanoid('cpl'),
        namespace,
      },
      spec: {
        approved: true,
        component: {
          name: `${repository}.${chartName}`,
          namespace: this.kubebbNS,
        },
        name: releaseName,
        version,
        override: {
          images,
          valuesFrom,
        },
      },
    });
    return true;
  }

  async update(
    auth: JwtAuth,
    name: string,
    namespace: string,
    componentplan: UpdateComponentplanInput,
    cluster?: string
  ): Promise<boolean> {
    const { version, componentPlanInstallMethod, valuesYaml, images } = componentplan;
    /**
     * 1. approved: false  -> 修改cpl，同时改 approved: true
     * 2. approved: true -> 创建cpl
     */
    const { approved, releaseName, subscriptionName, component, configmap } = await this.get(
      auth,
      name,
      namespace
    );
    const params = {
      ...componentplan,
      releaseName,
      chartName: component?.chartName,
      repository: component?.repository,
      configmap,
    };
    if (approved) {
      await this.create(auth, namespace, params, cluster);
    } else {
      let valuesFrom: any[];
      if (valuesYaml) {
        const cmName = await this.disposeValuesYaml(
          auth,
          namespace,
          {
            repository: component?.repository,
            chartName: component?.chartName,
            version,
            releaseName,
            valuesYaml,
            configmap,
          },
          cluster
        );
        if (cmName) {
          valuesFrom = [
            {
              kind: 'ConfigMap',
              name: cmName,
            },
          ];
        }
      }
      /**
       * 编辑：
       * 自动：有sub就修改，没有就创建；
       * 手动：有sub就修改，没有就不处理；
       * 最后修改cpl，同时approved：true？（修改sub，会自动修改cpl，后端支持后可去掉）
       */
      if (componentPlanInstallMethod === InstallMethod.auto) {
        if (subscriptionName) {
          await this.subscriptionService.updateSubscription(
            auth,
            subscriptionName,
            namespace,
            params,
            valuesFrom,
            cluster
          );
        } else {
          await this.create(auth, namespace, params, cluster);
          return true;
        }
      }
      if (componentPlanInstallMethod === InstallMethod.manual) {
        if (subscriptionName) {
          await this.subscriptionService.updateSubscription(
            auth,
            subscriptionName,
            namespace,
            params,
            valuesFrom,
            cluster
          );
        } else {
          const k8s = await this.k8sService.getClient(auth, { cluster });
          await k8s.componentplan.patchMerge(name, namespace, {
            spec: {
              approved: true,
              version,
              override: {
                images,
                valuesFrom,
              },
            },
          });
        }
      }
    }
    return true;
  }

  async remove(auth: JwtAuth, name: string, namespace: string, cluster?: string): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { releaseName, configmap } = await this.get(auth, name, namespace, cluster);
    const labelSelectors = [`core.kubebb.k8s.com.cn/componentplan-release=${releaseName}`];
    const cpls = await this.list(
      auth,
      namespace,
      { labelSelector: labelSelectors.join(',') },
      cluster
    );
    await Promise.all((cpls || []).map(cpl => k8s.componentplan.delete(cpl.name, namespace)));
    if (configmap) {
      try {
        await this.configmapService.deleteConfigmap(auth, configmap, namespace, cluster);
      } catch (err) {
        this.logger.warn('deleteConfigmap', `${err.statusCode}: ${err.body?.message}`);
      }
    }
    // 如果有sub，修改sub的自动更新为手动
    const subsName = (cpls || []).map(cpl => cpl.subscriptionName).filter(subN => !!subN);
    await Promise.all(
      (subsName || []).map(subName =>
        this.subscriptionService.updateSubscription(
          auth,
          subName,
          namespace,
          {
            componentPlanInstallMethod: InstallMethod.manual,
          },
          undefined,
          cluster
        )
      )
    );
    return true;
  }

  async rollback(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.componentplan.patchMerge(name, namespace, {
      metadata: {
        labels: {
          'core.kubebb.k8s.com.cn/rollback': 'true',
        },
      },
    });
    return true;
  }

  async disposeValuesYaml(
    auth: JwtAuth,
    namespace: string,
    { repository, chartName, version, releaseName, valuesYaml, configmap }: any,
    cluster?: string
  ): Promise<string> {
    if (configmap) {
      const { name } = await this.configmapService.updateConfigmap(
        auth,
        configmap,
        namespace,
        { 'values.yaml': valuesYaml },
        cluster
      );
      return name;
    }
    const { data: rawCM } = await this.configmapService.getConfigmap(
      auth,
      `${repository}.${chartName}-${version}`,
      this.kubebbNS,
      cluster
    );
    const rawVY = rawCM?.['values.yaml'];
    if (rawVY && genContentHash(rawVY) !== genContentHash(valuesYaml)) {
      const { name } = await this.configmapService.createConfigmap(
        auth,
        `${repository}.${chartName}-${releaseName}`,
        namespace,
        {
          'values.yaml': valuesYaml,
        },
        cluster
      );
      return name;
    }
    return null;
  }

  async getSubscriptionsForCpl(
    auth: JwtAuth,
    releaseName: string,
    namespace: string,
    component: string,
    cluster?: string
  ): Promise<Subscription[]> {
    const labelSelectors = [
      `core.kubebb.k8s.com.cn/component-name=${component}`,
      `core.kubebb.k8s.com.cn/componentplan-release=${releaseName}`,
    ];
    const subs = await this.subscriptionService.list(
      auth,
      namespace,
      {
        labelSelector: labelSelectors.join(','),
      },
      cluster
    );
    return subs;
  }
}
