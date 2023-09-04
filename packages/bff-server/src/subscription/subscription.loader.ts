import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'src/common/dataloader';
import { JwtAuth } from 'src/types';
import { Subscription } from './models/subscription.model';
import { SubscriptionService } from './subscription.service';

@Injectable({ scope: Scope.REQUEST })
export default class SubscriptionLoader extends OrderedNestDataLoader<
  Subscription['namespacedName'],
  Subscription
> {
  constructor(private readonly subscriptionService: SubscriptionService) {
    super();
  }

  protected getOptions = (auth: JwtAuth) => ({
    propertyKey: 'namespacedName',
    query: (keys: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, namespace, cluster] = keys[0]?.split('_');
      return this.subscriptionService.getSubscriptions(auth, namespace, cluster || undefined);
    },
  });
}
