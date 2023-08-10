import { Auth } from '@/common/decorators/auth.decorator';
import { JwtAuth } from '@/types';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ComponentsService } from './components.service';
import { ComponentArgs } from './dto/component.args';
import { CreateComponentInput } from './dto/create-component.input';
import { DeleteComponentInput } from './dto/delete-component.input';
import { Component, PaginatedComponent } from './models/component.model';

@Resolver(() => Component)
export class ComponentsResolver {
  constructor(private readonly componentsService: ComponentsService) {}

  @Query(() => PaginatedComponent, { description: '组件列表' })
  async components(
    @Auth() auth: JwtAuth,
    @Args() args: ComponentArgs
  ): Promise<PaginatedComponent> {
    return this.componentsService.getComponentsPaged(auth, args);
  }

  @Query(() => Component, { description: '组件详情' })
  async component(@Auth() auth: JwtAuth, @Args('name') name: string): Promise<Component> {
    return this.componentsService.getComponent(auth, name);
  }

  @Mutation(() => Boolean, { description: '发布组件' })
  async componentUpload(
    @Auth() auth: JwtAuth,
    @Args('chart') chart: CreateComponentInput
  ): Promise<boolean> {
    return this.componentsService.uploadChart(auth, chart);
  }

  @Mutation(() => Boolean, { description: '删除组件' })
  async componentDelete(
    @Auth() auth: JwtAuth,
    @Args('chart') chart: DeleteComponentInput
  ): Promise<boolean> {
    return this.componentsService.deleteChart(auth, chart);
  }
}
