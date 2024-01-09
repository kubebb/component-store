import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { CRD, JwtAuth } from '@/types';
import { Injectable } from '@nestjs/common';
import { Pipeline } from './models/pipeline.model';
@Injectable()
export class PipelineService {
  constructor(private readonly k8sService: KubernetesService) {}
  format(c: CRD.Pipeline): Pipeline {
    return {
      name: c.metadata?.name,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
      params: c.spec?.params || [],
    };
  }
  async list(auth: JwtAuth, namespace: string, cluster?: string): Promise<Pipeline[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.pipeline.list(namespace);
    return body.items
      ?.map(t => this.format(t))
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }
}
