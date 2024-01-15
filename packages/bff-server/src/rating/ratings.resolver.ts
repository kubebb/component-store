import { Auth } from '@/common/decorators/auth.decorator';
import { decodeBase64 } from '@/common/utils';
import serverConfig from '@/config/server.config';
import { ConfigmapService } from '@/configmap/configmap.service';
import { LlmService } from '@/llm/llm.service';
import { PromptService } from '@/prompt/prompt.service';
import { JwtAuth } from '@/types';
import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRatingsInput } from './dto/create-ratings.input';
import { RatingsArgs } from './dto/ratings.args';
import { Rating } from './models/ratings.model';
import { RatingsService } from './ratings.service';

@Resolver(() => Rating)
export class RatingsResolver {
  constructor(
    private readonly ratingsService: RatingsService,
    private readonly promptService: PromptService,
    private readonly llmService: LlmService,
    private readonly configmapService: ConfigmapService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}
  private kubebbNS = this.config.kubebb.namespace;

  @Query(() => Boolean, { description: '组件评测部署状态' })
  async ratingDeploymentStatus(
    @Auth() auth: JwtAuth,
    @Args('namespace', { nullable: true }) namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    const { data } = await this.configmapService.getConfigmap(
      auth,
      'system-llm',
      namespace || this.kubebbNS,
      cluster
    );
    const { status } = await this.llmService.get(auth, data?.name, data?.namespace, cluster);
    return status?.conditions?.some(
      v => v.type === 'Ready' && v.reason === 'Available' && v.status === 'True'
    );
  }

  @Query(() => [Rating], { description: '安装组件列表' })
  async ratings(
    @Auth() auth: JwtAuth,
    @Args('namespace', { nullable: true }) namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Rating[]> {
    return this.ratingsService.getRatingList(auth, namespace, cluster);
  }

  @Query(() => Rating, { description: '组件评测详情' })
  async rating(@Auth() auth: JwtAuth, @Args() args: RatingsArgs): Promise<Rating> {
    const { name, cluster, version } = args;
    const namespace = args.namespace || this.kubebbNS;
    let rating;
    if (name) {
      rating = await this.ratingsService.getRating(auth, args);
    } else {
      const ratingList = await this.ratingsService.getRatingList(auth, namespace, cluster);
      rating = ratingList[0];
    }
    const ratingResult = [];
    try {
      const evaluations = rating.prompt?.evaluations || {};
      const pipelineRuns = rating.prompt?.pipelineRuns || {};
      if (Object.values(evaluations)?.length) {
        for (const key of Object.keys(evaluations)) {
          if (evaluations[key]?.prompt) {
            const { prompt } = await this.promptService.get(
              auth,
              evaluations[key]?.prompt,
              namespace,
              cluster
            );
            let promptData = decodeBase64(prompt?.data);
            try {
              promptData = JSON.parse(
                JSON.parse(JSON.parse(promptData)?.data?.choices[0]?.content)
              );
            } catch (e) {
              Logger.warn(promptData);
              promptData = null;
            }
            evaluations[key].data = promptData;
            const evaluation = {
              type: key,
              ...(evaluations[key] || {}),
              ...(pipelineRuns[key] || {}),
              status: evaluations[key]?.conditions?.[0],
              taskName: pipelineRuns[key]?.pipelinerunName,
            };
            ratingResult.push(evaluation);
          }
        }
      }
    } catch (e) {}
    rating.prompt.ratingResult = ratingResult;

    try {
      if (rating.repository && rating.componentName && version) {
        const { name, binaryData } = await this.configmapService.getConfigmap(
          auth,
          `${rating.repository}.${rating.componentName}.${version}`,
          namespace,
          cluster
        );
        if (binaryData?.r) {
          binaryData.r = decodeBase64(binaryData.r);
        }
        rating.rbac = {
          name,
          digraph: binaryData?.r,
        };
      }
    } catch (e) {}
    return rating;
  }

  @Mutation(() => Boolean, { description: '创建组件评测' })
  async ratingCreate(
    @Auth() auth: JwtAuth,
    @Args('createRatingsInput') createRatingsInput: CreateRatingsInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    const namespace = createRatingsInput.namespace || this.kubebbNS;
    const { data } = await this.configmapService.getConfigmap(
      auth,
      'system-llm',
      namespace,
      cluster
    );
    return this.ratingsService.create(auth, data, createRatingsInput, cluster);
  }
}
