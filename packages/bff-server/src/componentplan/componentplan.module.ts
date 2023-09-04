import { Module } from '@nestjs/common';
import { ComponentplanResolver } from './componentplan.resolver';
import { ComponentplanService } from './componentplan.service';

@Module({
  providers: [ComponentplanResolver, ComponentplanService],
})
export class ComponentplanModule {}
