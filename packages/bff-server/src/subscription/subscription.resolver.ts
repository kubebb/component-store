import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Auth } from 'src/common/decorators/auth.decorator';
import { JwtAuth } from 'src/types';
import { CreateSubscriptionInput } from './dto/create-subscription.input';
import { SubscriptionArgs } from './dto/subscription.args';
import { PaginatedSubscription, Subscription } from './models/subscription.model';
import { SubscriptionService } from './subscription.service';

@Resolver(() => Subscription)
export class SubscriptionResolver {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Query(() => PaginatedSubscription, { description: '订阅列表（分页）' })
  async subscriptionsPaged(
    @Auth() auth: JwtAuth,
    @Args() args: SubscriptionArgs
  ): Promise<PaginatedSubscription> {
    return this.subscriptionService.getSubscriptionsPaged(auth, args);
  }

  @Query(() => [Subscription], { description: '订阅列表' })
  async subscriptions(
    @Auth() auth: JwtAuth,
    @Args('namespace') namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Subscription[]> {
    return this.subscriptionService.getSubscriptions(auth, namespace, cluster);
  }

  @Mutation(() => Boolean, { description: '订阅' })
  async subscriptionCreate(
    @Auth() auth: JwtAuth,
    @Args('subscription') subscription: CreateSubscriptionInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    return this.subscriptionService.createSubscription(auth, subscription, cluster);
  }

  @Mutation(() => Boolean, { description: '取消订阅' })
  async subscriptionRemove(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('namespace') namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    return this.subscriptionService.removeSubscription(auth, name, namespace, cluster);
  }
}
