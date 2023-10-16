import { Loader } from '@/common/dataloader';
import { Auth } from '@/common/decorators/auth.decorator';
import { Repository } from '@/repository/models/repository.model';
import { RepositoryLoader } from '@/repository/repository.loader';
import { RepositoryService } from '@/repository/repository.service';
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
    private readonly repositoryService: RepositoryService
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
    @Args('version') version: string
  ): Promise<ComponentChart> {
    const {
      variableValues: { cluster },
    } = info;
    const { name, namespace } = component;
    return this.componentsService.getChartValues(auth, name, namespace, version, cluster);
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
}
