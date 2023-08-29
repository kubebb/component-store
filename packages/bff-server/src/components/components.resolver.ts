import { Loader } from '@/common/dataloader';
import { Auth } from '@/common/decorators/auth.decorator';
import { Repository } from '@/repository/models/repository.model';
import { RepositoryLoader } from '@/repository/repository.loader';
import { JwtAuth } from '@/types';
import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { ComponentsService } from './components.service';
import { ComponentArgs } from './dto/component.args';
import { CreateComponentInput } from './dto/create-component.input';
import { DeleteComponentInput } from './dto/delete-component.input';
import { ComponentStatus } from './models/component-status.enum';
import { Component, PaginatedComponent } from './models/component.model';

@Resolver(() => Component)
export class ComponentsResolver {
  constructor(private readonly componentsService: ComponentsService) {}

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

  @ResolveField(() => ComponentStatus, { description: '状态' })
  async status(
    @Parent() component: Component,
    @Loader(RepositoryLoader) repositoryLoader: DataLoader<Repository['name'], Repository>
  ): Promise<string> {
    const { repository } = component;
    const repositoryDetail = await repositoryLoader.load(repository);
    if (!repositoryDetail) return null;
    const { lastSuccessfulTime, intervalSeconds } = repositoryDetail;
    const now = Date.now();
    const latest = new Date(lastSuccessfulTime).valueOf();
    if (latest + intervalSeconds > now) {
      return ComponentStatus.syncing;
    }
    return ComponentStatus.ready;
  }
}
