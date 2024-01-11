import serverConfig from '@/config/server.config';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { CRD, JwtAuth } from '@/types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Llm } from './models/llm.model';

@Injectable()
export class LlmService {
  constructor(
    private readonly k8sService: KubernetesService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}
  private kubebbNS = this.config.kubebb.namespace;

  format(c: CRD.LLM): Llm {
    return {
      name: c.metadata?.name,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
      status: c.status,
    };
  }
  async get(auth: JwtAuth, name: string, namespace: string, cluster?: string): Promise<Llm> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.llm.read(name, namespace || this.kubebbNS);
    return this.format(body);
  }
}
