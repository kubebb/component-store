import { ComponentsModule } from '@/components/components.module';
import { Module } from '@nestjs/common';
import { SubscriptionResolver } from './subscription.resolver';
import { SubscriptionService } from './subscription.service';

@Module({
  providers: [SubscriptionResolver, SubscriptionService],
  imports: [ComponentsModule],
})
export class SubscriptionModule {}
