import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { CRD, JwtAuth } from '@/types';
import { Injectable } from '@nestjs/common';
import { Prompt } from './models/prompt.model';
@Injectable()
export class PromptService {
  constructor(private readonly k8sService: KubernetesService) {}
  format(c: CRD.Prompt): Prompt {
    return {
      name: c.metadata?.name,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
      prompt: c.status,
    };
  }
  async get(auth: JwtAuth, name: string, namespace: string, cluster?: string): Promise<Prompt> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.prompt.read(name, namespace);
    return this.format(body);
  }
}
