import { SortDirection } from '@/common/models/sort-direction.enum';
import { genNanoid } from '@/common/utils';
import { CreateComponentplanInput } from '@/componentplan/dto/create-componentplan.input';
import { ComponentsService } from '@/components/components.service';
import { Component } from '@/components/models/component.model';
import serverConfig from '@/config/server.config';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { CRD, JwtAuth } from 'src/types';
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
      chartName: component?.chartName,
      latestVersion: component?.latestVersion,
      updatedAt: component?.updatedAt,
      component: component,
      repository: sub.spec?.repository?.name,
      componentPlanInstallMethod: sub.spec?.componentPlanInstallMethod,
      releaseName: sub.spec?.name,
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
    } = args;
    const res = await this.getSubscriptions(auth, namespace, cluster);
    const filteredRes = res?.filter(
      t =>
        (!chartName || t.chartName?.includes(chartName)) &&
        (!repository || t.repository?.includes(repository))
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
    cluster?: string
  ): Promise<boolean> {
    const { releaseName, chartName, repository, componentPlanInstallMethod, images, schedule } =
      componentplan;
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
        },
      },
    });
    return true;
  }
}
