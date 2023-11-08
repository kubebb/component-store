import { SortDirection } from '@/common/models/sort-direction.enum';
import { genNanoid } from '@/common/utils';
import { CreateComponentplanInput } from '@/componentplan/dto/create-componentplan.input';
import { ComponentsService } from '@/components/components.service';
import { Component } from '@/components/models/component.model';
import serverConfig from '@/config/server.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { CRD, JwtAuth, ListOptions } from 'src/types';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { SubscriptionArgs } from './dto/subscription.args';
import { UpdateSubscriptionInput } from './dto/update-subscription.input';
import { PaginatedSubscription, Subscription } from './models/subscription.model';

@Injectable()
export class SubscriptionService {
  constructor(
    private readonly k8sService: KubernetesService,
    private readonly componentsService: ComponentsService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}

  private kubebbNS = this.config.kubebb.namespace;

  format(sub: CRD.Subscription, component?: Component, cluster?: string): Subscription {
    return {
      name: sub.metadata?.name,
      namespace: sub.metadata?.namespace,
      namespacedName: `${sub.metadata?.name}_${sub.metadata.namespace}_${cluster || ''}`,
      creationTimestamp: new Date(sub.metadata?.creationTimestamp).toISOString(),
      component: component,
      repository: sub.spec?.repository?.name,
      componentPlanInstallMethod: sub.spec?.componentPlanInstallMethod,
      releaseName: sub.spec?.name,
      schedule: sub.spec?.schedule,
    };
  }

  async getSubscription(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<Subscription> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.subscription.read(name, namespace);
    return this.format(body);
  }

  async getSubscriptions(
    auth: JwtAuth,
    namespace: string,
    cluster?: string
  ): Promise<Subscription[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.subscription.list(namespace);
    const components = await this.componentsService.list(auth, cluster);
    return body.items
      ?.map(item => {
        const specComponent = item.spec?.component;
        const component = components?.find(c => c.name === specComponent?.name);
        return this.format(item, component, cluster);
      })
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }

  async list(
    auth: JwtAuth,
    namespace: string,
    options: ListOptions = {},
    cluster?: string
  ): Promise<Subscription[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.subscription.list(namespace, options);
    return body.items
      ?.map(item => this.format(item, null, cluster))
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }

  async getSubscriptionsPaged(
    auth: JwtAuth,
    args: SubscriptionArgs
  ): Promise<PaginatedSubscription> {
    const {
      page = 1,
      pageSize = 20,
      cluster,
      sortDirection,
      sortField,
      namespace,
      chartName,
      repository,
      isNewer,
    } = args;
    const res = await this.getSubscriptions(auth, namespace, cluster);
    const componentNameMap = new Map();
    const filteredRes = res
      ?.filter(t => {
        if (t.component?.name && !componentNameMap.has(t.component.name)) {
          componentNameMap.set(t.component.name, true);
          return true;
        }
        return false;
      })
      ?.filter(
        t =>
          (!chartName || t.component?.chartName?.includes(chartName)) &&
          (!repository || t.repository?.includes(repository)) &&
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

  async removeSubscription(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.subscription.delete(name, namespace);
    return true;
  }

  async batchRemove(
    auth: JwtAuth,
    componentName: string,
    namespace: string,
    cluster?: string
  ): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const labelSelectors = [`core.kubebb.k8s.com.cn/component-name=${componentName}`];
    const { body } = await k8s.subscription.list(namespace, {
      labelSelector: labelSelectors.join(','),
    });
    await Promise.all(
      (body.items || []).map(sub => k8s.subscription.delete(sub?.metadata?.name, namespace))
    );
    return true;
  }

  async createSubscription(
    auth: JwtAuth,
    subscription: CreateSubscriptionInput,
    cluster?: string
  ): Promise<boolean> {
    const { namespace, name } = subscription;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.subscription.create(namespace, {
      metadata: {
        name: genNanoid('subscription'),
        namespace,
      },
      spec: {
        component: {
          name,
          namespace: this.kubebbNS,
        },
        componentPlanInstallMethod: 'manual',
        name,
      },
    });
    return true;
  }

  async createSubscriptionByCpl(
    auth: JwtAuth,
    namespace: string,
    componentplan: CreateComponentplanInput,
    valuesFrom: any[],
    cluster?: string
  ): Promise<boolean> {
    const { releaseName, chartName, repository, componentPlanInstallMethod, images, schedule } =
      componentplan;
    // 期望结果：releaseName相同的sub有且只有一个
    const labelSelectors = [
      `core.kubebb.k8s.com.cn/component-name=${repository}.${chartName}`,
      `core.kubebb.k8s.com.cn/componentplan-release=${releaseName}`,
    ];
    const subs = await this.list(
      auth,
      namespace,
      {
        labelSelector: labelSelectors.join(','),
      },
      cluster
    );
    const sub = subs?.[0];
    if (sub) {
      await this.updateSubscription(
        auth,
        sub.name,
        sub.namespace,
        componentplan,
        valuesFrom,
        cluster
      );
      if (subs.length > 1) {
        await Promise.all(
          (subs.slice(1) || []).map(d => k8s.subscription.delete(d.name, d.namespace))
        );
      }
      return true;
    }
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.subscription.create(namespace, {
      metadata: {
        name: genNanoid('subscription'),
        namespace,
      },
      spec: {
        component: {
          name: `${repository}.${chartName}`,
          namespace: this.kubebbNS,
        },
        name: releaseName,
        componentPlanInstallMethod,
        schedule,
        override: {
          images,
          valuesFrom,
        },
      },
    });
    return true;
  }

  async updateSubscription(
    auth: JwtAuth,
    name: string,
    namespace: string,
    componentplan: UpdateSubscriptionInput,
    valuesFrom?: any[],
    cluster?: string
  ): Promise<boolean> {
    const { componentPlanInstallMethod, images, schedule } = componentplan;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.subscription.patchMerge(name, namespace, {
      spec: {
        componentPlanInstallMethod,
        schedule,
        override: {
          images,
          valuesFrom,
        },
      },
    });
    return true;
  }
}
