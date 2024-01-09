import { Auth } from '@/common/decorators/auth.decorator';
import { decodeBase64 } from '@/common/utils';
import serverConfig from '@/config/server.config';
import { ConfigmapService } from '@/configmap/configmap.service';
import { PromptService } from '@/prompt/prompt.service';
import { JwtAuth } from '@/types';
import { Inject } from '@nestjs/common';
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
    private readonly configmapService: ConfigmapService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}
  private kubebbNS = this.config.kubebb.namespace;

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

    try {
      const evaluations = rating.prompt?.evaluations || {};
      if (Object.values(evaluations)?.length) {
        for (const key of Object.keys(evaluations)) {
          if (evaluations[key]?.prompt) {
            const { prompt } = await this.promptService.get(
              auth,
              evaluations[key]?.prompt,
              namespace,
              cluster
            );
            evaluations[key].data = decodeBase64(prompt?.data);
          }
        }
      }
    } catch (e) {}

    try {
      if (rating.repository && rating.componentName && version) {
        const binaryData = await this.configmapService.getConfigmap(
          auth,
          `${rating.repository}.${rating.componentName}.${version}`,
          namespace,
          cluster
        );
        if (binaryData?.binaryData?.r) {
          binaryData.binaryData.r = decodeBase64(binaryData.binaryData.r);
        }
        rating.rbac = binaryData;
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
    return this.ratingsService.create(auth, createRatingsInput, cluster);
  }
}
