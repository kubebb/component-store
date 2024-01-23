import { Loader } from '@/common/dataloader';
import { Auth } from '@/common/decorators/auth.decorator';
import { Prompt } from '@/prompt/models/prompt.model';
import { PromptLoader } from '@/prompt/prompt.loader';
import { RatingsService } from '@/rating/ratings.service';
import { Repository, RepositoryImageOverride } from '@/repository/models/repository.model';
import { RepositoryLoader } from '@/repository/repository.loader';
import { AnyObj, JwtAuth } from '@/types';
import { Args, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { ComponentsService } from './components.service';
import { ComponentArgs } from './dto/component.args';
import { CreateComponentInput } from './dto/create-component.input';
import { DeleteComponentInput } from './dto/delete-component.input';
import { DownloadComponentInput } from './dto/download-component.input';
import { ComponentSource } from './models/component-source.enum';
import { ComponentStatus } from './models/component-status.enum';
import { Component, ComponentChart, PaginatedComponent } from './models/component.model';

@Resolver(() => Component)
export class ComponentsResolver {
  constructor(
    private readonly componentsService: ComponentsService,
    private readonly ratingsService: RatingsService
  ) {}

  @Query(() => PaginatedComponent, { description: '组件列表（分页）' })
  async components(
    @Auth() auth: JwtAuth,
    @Args() args: ComponentArgs
  ): Promise<PaginatedComponent> {
    return this.componentsService.getComponentsPaged(auth, args);
  }

  @Query(() => [Component], { description: '组件列表' })
  async componentsAll(@Auth() auth: JwtAuth): Promise<Component[]> {
    return this.componentsService.listComponents(auth);
  }

  @Query(() => Component, { description: '组件详情' })
  async component(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Component> {
    return this.componentsService.getComponent(auth, name, cluster);
  }

  @Mutation(() => Boolean, { description: '发布组件' })
  async componentUpload(
    @Auth() auth: JwtAuth,
    @Args('chart') chart: CreateComponentInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    return this.componentsService.uploadChart(auth, chart, cluster);
  }

  @Mutation(() => Boolean, { description: '删除组件' })
  async componentDelete(
    @Auth() auth: JwtAuth,
    @Args('chart') chart: DeleteComponentInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    return this.componentsService.deleteChart(auth, chart, cluster);
  }

  @Mutation(() => String, { description: '下载组件' })
  async componentDownload(
    @Auth() auth: JwtAuth,
    @Args('chart') chart: DownloadComponentInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<string> {
    return this.componentsService.downloadChart(auth, chart, cluster);
  }

  @ResolveField(() => ComponentStatus, { description: '状态' })
  async status(
    @Info() info: AnyObj,
    @Parent() component: Component,
    @Loader(RepositoryLoader) repositoryLoader: DataLoader<Repository['namespacedName'], Repository>
  ): Promise<string> {
    const {
      variableValues: { cluster },
    } = info;
    const { repository, namespace } = component;
    const repositoryDetail = await repositoryLoader.load(
      `${repository}_${namespace}_${cluster || ''}`
    );
    if (repositoryDetail) {
      const { lastSuccessfulTime, intervalSeconds } = repositoryDetail;
      const now = Date.now();
      const latest = new Date(lastSuccessfulTime).valueOf();
      if (latest + intervalSeconds > now) {
        return ComponentStatus.syncing;
      }
    }
    return ComponentStatus.ready;
  }

  @ResolveField(() => ComponentSource, { description: '来源' })
  async source(
    @Info() info: AnyObj,
    @Parent() component: Component,
    @Loader(RepositoryLoader) repositoryLoader: DataLoader<Repository['namespacedName'], Repository>
  ): Promise<string> {
    const {
      variableValues: { cluster },
    } = info;
    const { repository, namespace } = component;
    const repositoryDetail = await repositoryLoader.load(
      `${repository}_${namespace}_${cluster || ''}`
    );
    const source = repositoryDetail?.labels?.['kubebb.repository.source'];
    if (source === ComponentSource.official) {
      return ComponentSource.official;
    }
    return null;
  }

  @ResolveField(() => ComponentChart, { description: 'Helm Chart信息' })
  async chart(
    @Auth() auth: JwtAuth,
    @Info() info: AnyObj,
    @Parent() component: Component,
    @Loader(RepositoryLoader)
    repositoryLoader: DataLoader<Repository['namespacedName'], Repository>,
    @Args('version') version: string
  ): Promise<ComponentChart> {
    const {
      variableValues: { cluster },
    } = info;
    const { name, namespace, repository } = component;
    let imageOverride: RepositoryImageOverride[];
    if (repository && namespace) {
      const repo = await repositoryLoader.load(`${repository}_${namespace}_${cluster || ''}`);
      imageOverride = repo.imageOverride;
    }
    const chart = await this.componentsService.getChartValues(
      auth,
      name,
      namespace,
      version,
      cluster
    );
    const imagesFaked = chart.imagesFaked;
    chart.imagesOptions = imagesFaked?.map(f => {
      const matchedImage = imageOverride?.find(d => d.path === f.path && d.registry === f.registry);
      return {
        image: f.image,
        id: f.id,
        registry: matchedImage?.newRegistry,
        path: matchedImage?.newPath,
        name: f.name,
        tag: f.tag,
        matched: !!matchedImage?.newRegistry && !!matchedImage?.newPath,
      };
    });
    return chart;
  }

  @ResolveField(() => Repository, { nullable: true, description: '所属仓库' })
  async repositoryCR(
    @Info() info: AnyObj,
    @Parent() component: Component,
    @Loader(RepositoryLoader) repositoryLoader: DataLoader<Repository['namespacedName'], Repository>
  ): Promise<Repository> {
    const {
      variableValues: { cluster },
    } = info;
    const { repository, namespace } = component;
    if (!repository || !namespace) return null;
    return repositoryLoader.load(`${repository}_${namespace}_${cluster || ''}`);
  }

  @ResolveField(() => Number, { description: '最新评分' })
  async latestScore(
    @Auth() auth: JwtAuth,
    @Info() info: AnyObj,
    @Parent() component: Component,
    @Loader(PromptLoader) promptLoader: DataLoader<Prompt['namespacedName'], Prompt>
  ): Promise<number> {
    const {
      variableValues: { cluster },
    } = info;
    const { name, repository, namespace, latestVersion } = component;
    const ratings = await this.ratingsService.getRatingList(auth, {
      repository,
      componentName: name,
      version: latestVersion,
      namespace,
      cluster,
    });
    const rating = ratings.find(rating => rating.status === 'EvaluationSucceeded');
    if (rating) {
      const { namespace, promptNames } = rating;
      const names = promptNames.map(prompt => `${prompt}_${namespace}_${cluster || ''}`);
      let prompts = [];
      try {
        prompts = await promptLoader.loadMany(names);
      } catch (e) {
        return;
      }
      const score = prompts?.reduce((v, cur) => v + cur.score, 0);
      return Math.round(score / (prompts.length || 1));
    }
    return;
  }
}
