import { ComponentsModule } from '@/components/components.module';
import { Module } from '@nestjs/common';
import SubscriptionLoader from './subscription.loader';
import { SubscriptionResolver } from './subscription.resolver';
import { SubscriptionService } from './subscription.service';

@Module({
  providers: [SubscriptionResolver, SubscriptionService, SubscriptionLoader],
  exports: [SubscriptionLoader, SubscriptionService],
  imports: [ComponentsModule],
})
export class SubscriptionModule {}
