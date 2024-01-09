import { genNanoid } from '@/common/utils';
import { ComponentsService } from '@/components/components.service';
import { Component } from '@/components/models/component.model';
import serverConfig from '@/config/server.config';
import { ConfigmapService } from '@/configmap/configmap.service';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { Pipeline } from '@/pipeline/models/pipeline.model';
import { PipelineService } from '@/pipeline/pipeline.service';
import { RatingsArgs } from '@/rating/dto/ratings.args';
import { AnyObj, CRD, JwtAuth } from '@/types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CreateRatingsInput } from './dto/create-ratings.input';
import { Rating } from './models/ratings.model';

@Injectable()
export class RatingsService {
  constructor(
    private readonly k8sService: KubernetesService,
    private readonly pipelineService: PipelineService,
    private readonly componentsService: ComponentsService,
    private readonly configmapService: ConfigmapService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}
  private kubebbNS = this.config.kubebb.namespace;

  formatRating(c: CRD.Rating): Rating {
    return {
      name: c.metadata?.name,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
      componentName: c.spec?.componentName,
      repository: c.metadata?.labels['rating.repository'],
      prompt: c.status,
    };
  }

  async getRatingList(auth: JwtAuth, namespace?: string, cluster?: string): Promise<Rating[]> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.rating.list(namespace || this.kubebbNS);
    return body.items
      ?.map(item => this.formatRating(item))
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }

  async getRating(auth: JwtAuth, args: RatingsArgs): Promise<Rating> {
    const { name, namespace = this.kubebbNS, cluster } = args;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.rating.read(name, namespace);
    return this.formatRating(body);
  }

  async create(
    auth: JwtAuth,
    llm: AnyObj,
    createRatingsInput: CreateRatingsInput,
    cluster?: string
  ): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { componentName, version, url, namespace = this.kubebbNS } = createRatingsInput;
    const pipelines: Pipeline[] = await this.pipelineService.list(auth, namespace, cluster);
    const { repository }: Component = await this.componentsService.getComponent(
      auth,
      componentName,
      cluster
    );
    const pipelineParams = pipelines?.map(pipeline => ({
      pipelineName: pipeline?.name,
      dimension: pipeline?.name?.split('-')?.pop(),
      params: pipeline?.params?.map(({ name, type }) => {
        const param = {
          COMPONENT_NAME: componentName,
          REPOSITORY_NAME: repository,
          VERSION: version,
          URL: url,
        };
        return {
          name,
          value: {
            type,
            [`${type}Val`]: param[name],
          },
        };
      }),
    }));

    await k8s.rating.create(namespace, {
      metadata: {
        name: genNanoid('rating-'),
        namespace,
      },
      spec: {
        componentName,
        evaluator: {
          llm: {
            kind: 'LLM',
            name: llm?.name,
            namespace: llm?.namespace,
          },
        },
        pipelineParams,
      },
    });
    return true;
  }
}
