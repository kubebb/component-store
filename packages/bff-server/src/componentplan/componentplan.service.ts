import { SortDirection } from '@/common/models/sort-direction.enum';
import { genNanoid } from '@/common/utils';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { CRD, JwtAuth } from '@/types';
import { Injectable } from '@nestjs/common';
import { ComponentplanArgs } from './dto/componentplan.args';
import { CreateComponentplanInput } from './dto/create-componentplan.input';
import { UpdateComponentplanInput } from './dto/update-componentplan.input';
import { Componentplan, PaginatedComponentplan } from './models/componentplan.model';
import { ComponentplanStatus } from './models/status-componentplan.enum';

@Injectable()
export class ComponentplanService {
  constructor(private readonly k8sService: KubernetesService) {}

  format(cp: CRD.ComponentPlan): Componentplan {
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
      specComponent: cp.spec?.component,
      version: cp.spec?.version,
      releaseName: cp.spec?.name,
      subscriptionName: cp.metadata?.labels?.['core.kubebb.k8s.com.cn/subscription-name'],
      status,
    };
  }

  async list(auth: JwtAuth, namespace: string, cluster?: string): Promise<Componentplan[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.list(namespace);
    return body.items
      ?.map(t => this.format(t))
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
    return this.format(body);
  }

  async listPaged(auth: JwtAuth, args: ComponentplanArgs): Promise<PaginatedComponentplan> {
    const { page, pageSize, releaseName, sortDirection, sortField, cluster, namespace } = args;
    const res = await this.list(auth, namespace, cluster);
    const filteredRes = res?.filter(t => !releaseName || t.releaseName?.includes(releaseName));
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

  async create(
    auth: JwtAuth,
    namespace: string,
    componentplan: CreateComponentplanInput,
    cluster?: string
  ): Promise<Componentplan> {
    const { displayName } = componentplan;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.create(namespace, {
      metadata: {
        name: genNanoid('componentplan'),
        annotations: {
          displayName,
        },
      },
    });
    return this.format(body);
  }

  async update(
    auth: JwtAuth,
    name: string,
    namespace: string,
    componentplan: UpdateComponentplanInput,
    cluster?: string
  ): Promise<Componentplan> {
    const { displayName } = componentplan;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.componentplan.patchMerge(name, namespace, {
      metadata: {
        annotations: {
          displayName,
        },
      },
    });
    return this.format(body);
  }

  async remove(auth: JwtAuth, name: string, namespace: string, cluster?: string): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.componentplan.delete(name, namespace);
    return true;
  }
}
