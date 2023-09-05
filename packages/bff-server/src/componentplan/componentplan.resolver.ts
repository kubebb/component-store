import { Loader } from '@/common/dataloader';
import { Auth } from '@/common/decorators/auth.decorator';
import { ComponentLoader } from '@/components/components.loader';
import { Component } from '@/components/models/component.model';
import { Subscription } from '@/subscription/models/subscription.model';
import SubscriptionLoader from '@/subscription/subscription.loader';
import { AnyObj, JwtAuth } from '@/types';
import { Args, Info, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import DataLoader from 'dataloader';
import { ComponentplanService } from './componentplan.service';
import { ComponentplanArgs } from './dto/componentplan.args';
import { CreateComponentplanInput } from './dto/create-componentplan.input';
import { UpdateComponentplanInput } from './dto/update-componentplan.input';
import { Componentplan, PaginatedComponentplan } from './models/componentplan.model';

@Resolver(() => Componentplan)
export class ComponentplanResolver {
  constructor(private readonly componentplanService: ComponentplanService) {}

  @Query(() => PaginatedComponentplan, { description: '安装组件列表（分页）' })
  async componentplansPaged(
    @Auth() auth: JwtAuth,
    @Args() args: ComponentplanArgs
  ): Promise<PaginatedComponentplan> {
    return this.componentplanService.listPaged(auth, args);
  }

  @Query(() => Componentplan, { description: '安装组件详情' })
  async componentplan(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('namespace') namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Componentplan> {
    return this.componentplanService.get(auth, name, namespace, cluster);
  }

  @Mutation(() => Componentplan, { description: '安装组件创建' })
  async componentplanCreate(
    @Auth() auth: JwtAuth,
    @Args('namespace') namespace: string,
    @Args('componentplan') componentplan: CreateComponentplanInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Componentplan> {
    return this.componentplanService.create(auth, namespace, componentplan, cluster);
  }

  @Mutation(() => Componentplan, { description: '安装组件更新' })
  async componentplanUpdate(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('namespace') namespace: string,
    @Args('componentplan') componentplan: UpdateComponentplanInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ) {
    return this.componentplanService.update(auth, name, namespace, componentplan, cluster);
  }

  @Mutation(() => Boolean, { description: '安装组件删除' })
  async componentplanRemove(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('namespace') namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    return this.componentplanService.remove(auth, name, namespace, cluster);
  }

  @ResolveField(() => Component, { description: '组件' })
  async component(
    @Info() info: AnyObj,
    @Parent() componentplan: Componentplan,
    @Loader(ComponentLoader) componentLoader: DataLoader<Component['namespacedName'], Component>
  ): Promise<Component> {
    const {
      variableValues: { cluster },
    } = info;
    const { specComponent } = componentplan;
    if (!specComponent?.name) return null;
    const component = await componentLoader.load(
      `${specComponent.name}_${specComponent.namespace}_${cluster || ''}`
    );
    return component;
  }

  @ResolveField(() => Subscription, { description: '订阅' })
  async subscription(
    @Info() info: AnyObj,
    @Parent() componentplan: Componentplan,
    @Loader(SubscriptionLoader)
    subscriptionLoader: DataLoader<Subscription['namespacedName'], Subscription>
  ): Promise<Subscription> {
    const {
      variableValues: { cluster },
    } = info;
    const { namespace, subscriptionName } = componentplan;
    if (!subscriptionName) return null;
    const subscription = await subscriptionLoader.load(
      `${subscriptionName}_${namespace}_${cluster || ''}`
    );
    return subscription;
  }
}