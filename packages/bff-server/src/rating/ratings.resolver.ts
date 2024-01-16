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

  @Query(() => Rating, { nullable: true, description: '组件评测详情' })
  async rating(@Auth() auth: JwtAuth, @Args() args: RatingsArgs): Promise<Rating> {
    const { name } = args;
    if (name) {
      return this.ratingsService.getRating(auth, args);
    }
    return (await this.ratingsService.getRatingList(auth, args))[0];
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

  @ResolveField(() => String, { nullable: true, description: 'rbac权限图' })
  async rbac(
    @Auth() auth: JwtAuth,
    @Info() info: AnyObj,
    @Parent() rating: Rating
  ): Promise<string> {
    const {
      variableValues: { cluster },
    } = info;
    const { repository, componentName, version, namespace } = rating;
    try {
      if (repository && componentName && version) {
        const { binaryData } = await this.configmapService.getConfigmap(
          auth,
          `${repository}.${componentName}.${version}`,
          namespace,
          cluster
        );
        return decodeBase64(binaryData?.r);
      }
    } catch (e) {
      Logger.warn(e);
    }
    return null;
  }

  @ResolveField(() => [Prompt], { nullable: true, description: 'prompts' })
  async prompts(
    @Info() info: AnyObj,
    @Parent() rating: Rating,
    @Loader(PromptLoader) promptLoader: DataLoader<Prompt['namespacedName'], Prompt>
  ): Promise<Array<Error | Prompt>> {
    const {
      variableValues: { cluster },
    } = info;
    const { namespace, promptNames } = rating;
    const names = promptNames.map(prompt => `${prompt}_${namespace}_${cluster || ''}`);
    return promptLoader.loadMany(names);
  }
}
