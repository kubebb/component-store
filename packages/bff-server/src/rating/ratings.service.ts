import { genNanoid } from '@/common/utils';
import { ComponentsService } from '@/components/components.service';
import { Component } from '@/components/models/component.model';
import serverConfig from '@/config/server.config';
import { ConfigmapService } from '@/configmap/configmap.service';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { Pipeline } from '@/pipeline/models/pipeline.model';
import { PipelineService } from '@/pipeline/pipeline.service';
import { RatingsArgs } from '@/rating/dto/ratings.args';
import { RatingStatus } from '@/rating/models/rating.status.enum';
import { Repository } from '@/repository/models/repository.model';
import { RepositoryService } from '@/repository/repository.service';
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
    private readonly repositoryService: RepositoryService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}
  private kubebbNS = this.config.kubebb.namespace;

  formatRating(c: CRD.Rating): Rating {
    const evaluations = c.status?.evaluations || {};
    const promptNames = Object.keys(evaluations).map(key => evaluations[key]?.prompt);
    const repository = c.metadata?.labels['rating.repository'] || '';
    const version = c.metadata?.labels['rating.component.version'] || '';
    const status = RatingStatus[c.status?.conditions?.[0]?.reason];
    return {
      name: c.metadata?.name,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
      componentName: c.spec?.componentName,
      namespace: c.metadata.namespace,
      version,
      repository,
      promptNames,
      status,
    };
  }

  async getRatingList(auth: JwtAuth, args: RatingsArgs): Promise<Rating[]> {
    const { repository, componentName, version, namespace, cluster } = args;
    const labelSelectors = [];
    repository && labelSelectors.push(`rating.repository=${repository}`);
    componentName && labelSelectors.push(`rating.component=${componentName}`);
    version && labelSelectors.push(`rating.component.version=${version}`);
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.rating.list(namespace || this.kubebbNS, {
      labelSelector: labelSelectors.join(','),
    });
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
    const { repositoryType, url: repositoryUrl }: Repository =
      await this.repositoryService.getRepository(auth, repository, cluster);
    const pipelineParams = pipelines?.map(pipeline => ({
      pipelineName: pipeline?.name,
      dimension: pipeline?.dimension,
      params: pipeline?.params?.map(({ name, type }) => {
        const param = {
          COMPONENT_NAME: componentName,
          REPOSITORY_NAME: repository,
          VERSION: version,
          URL: repositoryType === 'chartmuseum' ? `${repositoryUrl}${url}` : url,
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
        labels: {
          'rating.component.version': version,
        },
        name: genNanoid('rating'),
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
