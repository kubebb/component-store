import { Loader } from '@/common/dataloader';
import { Auth } from '@/common/decorators/auth.decorator';
import { decodeBase64 } from '@/common/utils';
import serverConfig from '@/config/server.config';
import { ConfigmapService } from '@/configmap/configmap.service';
import { LlmService } from '@/llm/llm.service';
import { Prompt } from '@/prompt/models/prompt.model';
import { PromptLoader } from '@/prompt/prompt.loader';
import { PromptService } from '@/prompt/prompt.service';
import { AnyObj, JwtAuth } from '@/types';
import { Inject, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { Args, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { CreateRatingsInput } from './dto/create-ratings.input';
import { RatingsArgs, RatingStatus } from './dto/ratings.args';
import { Rating, RatingConditionsField } from './models/ratings.model';
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

  @Query(() => [Rating], { description: '组件评测列表' })
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
    const { name, componentName, cluster, version } = args;
    const namespace = args.namespace || this.kubebbNS;
    let rating;
    if (name) {
      rating = await this.ratingsService.getRating(auth, args);
    } else if (componentName) {
      const ratingList = await this.ratingsService.getRatingList(auth, namespace, cluster);
      rating = ratingList.filter(r => r.componentName === componentName)[0];
    }

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

  @ResolveField(() => [Prompt], { description: 'prompt' })
  async prompt(
    @Info() info: AnyObj,
    @Parent() rating: Rating,
    @Loader(PromptLoader) promptLoader: DataLoader<Prompt['namespacedName'], Prompt>
  ): Promise<{
    ratingResult: Array<Error | Prompt>;
    status: RatingConditionsField;
    score: number;
  }> {
    const {
      variableValues: { cluster },
    } = info;
    const { namespace, prompt } = rating;
    const dimensions = [];
    const evaluations = prompt.evaluations || {};
    Object.keys(evaluations).forEach(key => {
      dimensions.push(`${evaluations[key]?.prompt}_${namespace}_${cluster || ''}`);
    });
    let ratingResult;
    try {
      ratingResult = await promptLoader.loadMany(dimensions);
    } catch (e) {
      ratingResult = [];
      Logger.warn(e);
    }
    const score = Math.round(
      ratingResult?.reduce((v, cur) => v + cur.score, 0) / (ratingResult?.length || 1)
    );
    prompt.status.status = RatingStatus[prompt.status?.reason];
    return {
      score,
      status: prompt.status,
      ratingResult,
    };
  }
}
