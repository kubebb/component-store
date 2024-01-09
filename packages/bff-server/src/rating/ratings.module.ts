import { ComponentsModule } from '@/components/components.module';
import { ConfigmapModule } from '@/configmap/configmap.module';
import { PipelineModule } from '@/pipeline/pipeline.module';
import { PromptModule } from '@/prompt/prompt.module';
import { Module } from '@nestjs/common';
import { RatingsResolver } from './ratings.resolver';
import { RatingsService } from './ratings.service';

@Module({
  providers: [RatingsService, RatingsResolver],
  imports: [ComponentsModule, PipelineModule, PromptModule, ConfigmapModule],
})
export class RatingsModule {}
