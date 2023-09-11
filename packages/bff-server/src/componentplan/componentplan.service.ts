import { SortDirection } from '@/common/models/sort-direction.enum';
import { genNanoid } from '@/common/utils';
import { ComponentsService } from '@/components/components.service';
import { Component } from '@/components/models/component.model';
import serverConfig from '@/config/server.config';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { InstallMethod } from '@/subscription/models/installmethod.enum';
import { SubscriptionService } from '@/subscription/subscription.service';
import { CRD, JwtAuth, ListOptions } from '@/types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { ComponentplanArgs } from './dto/componentplan.args';
import { CreateComponentplanInput } from './dto/create-componentplan.input';
import { UpdateComponentplanInput } from './dto/update-componentplan.input';
import { Componentplan, PaginatedComponentplan } from './models/componentplan.model';
import { ComponentplanStatus } from './models/status-componentplan.enum';

@Injectable()
export class ComponentplanService {
  constructor(
    private readonly k8sService: KubernetesService,
    private readonly componentsService: ComponentsService,
    private readonly subscriptionService: SubscriptionService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}

  private kubebbNS = this.config.kubebb.namespace;

  format(cp: CRD.ComponentPlan, component?: Component): Componentplan {
    let status = ComponentplanStatus.Unknown;
    const conditions = cp.status?.conditions;
    if (conditions) {
      const succeeded = conditions.find(c => c.type === 'Succeeded');
      const actioned = conditions.find(c => c.type === 'Actioned');
      if (succeeded?.status === 'False') {
        status = ComponentplanStatus[actioned.reason] || ComponentplanStatus.Failed;
      }
      if (succeeded?.status === 'True') {
        status = ComponentplanStatus[actioned.reason] || ComponentplanStatus.Succeeded;
      }
    }

    return {
      name: cp.metadata?.name,
      creationTimestamp: new Date(cp.metadata?.creationTimestamp).toISOString(),
      namespace: cp.metadata?.namespace,
      component,
      version: cp.spec?.version,
      releaseName: cp.spec?.name,
      subscriptionName: cp.metadata?.labels?.['core.kubebb.k8s.com.cn/subscription-name'],
      approved: cp.spec?.approved,
      status,
      latest: cp.status?.latest,
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
      cm = await this.componentsService.getComponent(auth, body.spec.component.name, cluster);
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
    } = args;
    const res = await this.list(auth, namespace, {}, cluster);
    // 过滤出 以releaseName为唯一ID，选择cpl status.latest == true（其中sub创建的cpl（status.latest == null），通过「组件市场」安装入口安装）
    const releasenameMap = new Map();
    res?.forEach(cpl => {
      if (cpl.releaseName) {
        const num = releasenameMap.get(cpl.releaseName) || 0;
        releasenameMap.set(cpl.releaseName, num + 1);
      }
    });
    const fRes = res?.filter(
      t =>
        !releasenameMap.has(t.releaseName) ||
        releasenameMap.get(t.releaseName) <= 1 ||
        t.latest === true
    );
    // 根据搜索条件过滤
    const filteredRes = fRes?.filter(
      t =>
        (!releaseName || t.releaseName?.includes(releaseName)) &&
        (!chartName || t.component?.chartName?.includes(chartName)) &&
        (!repository || t.component?.repository?.includes(repository))
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
    componentplan: CreateComponentplanInput,
    cluster?: string
  ): Promise<boolean> {
    /**
     * 创建：
     * 1. 自动：只创建sub（？如果已有sub呢？）
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
    } = componentplan;
    if (componentPlanInstallMethod === InstallMethod.auto) {
      await this.subscriptionService.createSubscriptionByCpl(
        auth,
        namespace,
        componentplan,
        cluster
      );
      return true;
    }
    const k8s = await this.k8sService.getClient(auth, { cluster });
    if (valuesYaml) {
      // TODO 比对不同，则创建configmap
    }
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
    const { approved, releaseName, subscriptionName, component } = await this.get(
      auth,
      name,
      namespace
    );
    const params = {
      ...componentplan,
      releaseName,
      chartName: component?.chartName,
      repository: component?.repository,
    };
    if (approved) {
      await this.create(auth, namespace, params, cluster);
    } else {
      /**
       * 编辑：
       * 自动：有sub就修改，没有就创建；
       * 手动：有sub就修改，没有就不处理；
       * 最后修改cpl，同时approved：true;
       */
      if (componentPlanInstallMethod === InstallMethod.auto) {
        if (subscriptionName) {
          await this.subscriptionService.updateSubscription(
            auth,
            subscriptionName,
            namespace,
            params,
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
            cluster
          );
        }
      }
      const k8s = await this.k8sService.getClient(auth, { cluster });
      if (valuesYaml) {
        // TODO 比对不同，则创建configmap
      }
      await k8s.componentplan.patchMerge(name, namespace, {
        spec: {
          approved: true,
          version,
          override: {
            images,
          },
        },
      });
    }
    return true;
  }

  async remove(auth: JwtAuth, name: string, namespace: string, cluster?: string): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { releaseName } = await this.get(auth, name, namespace, cluster);
    const labelSelectors = [`core.kubebb.k8s.com.cn/componentplan-release=${releaseName}`];
    const cpls = await this.list(
      auth,
      namespace,
      { labelSelector: labelSelectors.join(',') },
      cluster
    );
    await Promise.all((cpls || []).map(cpl => k8s.componentplan.delete(cpl.name, namespace)));
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
}
