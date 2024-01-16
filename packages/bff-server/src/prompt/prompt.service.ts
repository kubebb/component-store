import { decodeBase64 } from '@/common/utils';
import serverConfig from '@/config/server.config';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { PromptStatus } from '@/prompt/models/prompt.status.enum';
import { CRD, JwtAuth } from '@/types';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Prompt } from './models/prompt.model';

@Injectable()
export class PromptService {
  constructor(
    private readonly k8sService: KubernetesService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}
  private kubebbNS = this.config.kubebb.namespace;

  format(c: CRD.Prompt, cluster?: string): Prompt {
    let promptData;
    try {
      promptData = JSON.parse(
        JSON.parse(JSON.parse(decodeBase64(c.status?.data))?.data?.choices[0]?.content)
      );
    } catch (e) {
      Logger.warn(promptData);
      promptData = null;
    }
    const ratingName = c.metadata?.labels['core.kubebb.k8s.com.cn/rating'];
    const dimension = c.metadata?.labels['core.kubebb.k8s.com.cn/dimension'];
    const pipelinerun = c.metadata?.labels['core.kubebb.k8s.com.cn/pipelinerun'];
    const status = c.status?.conditions?.[0];
    return {
      name: c.metadata?.name,
      dimension,
      ratingName,
      pipelinerun,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
      namespacedName: `${c.metadata?.name}_${c.metadata.namespace}_${cluster || ''}`,
      score: promptData?.chinese?.score || 0,
      suggestions: promptData?.chinese?.suggestions?.join(',') || '',
      problems: promptData?.chinese?.problems?.join(',') || '',
      status: {
        ...(status || {}),
        status: PromptStatus[status?.reason],
      },
    };
  }
  async get(auth: JwtAuth, name: string, namespace: string, cluster?: string): Promise<Prompt> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.prompt.read(name, namespace);
    return this.format(body, cluster);
  }

  async getPromptList(auth: JwtAuth, namespace?: string, cluster?: string): Promise<Prompt[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.prompt.list(namespace || this.kubebbNS);
    return body.items
      ?.map(item => this.format(item, cluster))
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }
}
