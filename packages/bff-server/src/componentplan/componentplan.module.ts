import { ComponentsModule } from '@/components/components.module';
import { ConfigmapModule } from '@/configmap/configmap.module';
import { SubscriptionModule } from '@/subscription/subscription.module';
import { Module } from '@nestjs/common';
import { ComponentplanResolver } from './componentplan.resolver';
import { ComponentplanService } from './componentplan.service';

@Module({
  providers: [ComponentplanResolver, ComponentplanService],
  imports: [SubscriptionModule, ComponentsModule, ConfigmapModule],
})
export class ComponentplanModule {}
