import { ComponentsModule } from '@/components/components.module';
import { ConfigmapModule } from '@/configmap/configmap.module';
import { LlmModule } from '@/llm/llm.module';
import { PipelineModule } from '@/pipeline/pipeline.module';
import { PromptModule } from '@/prompt/prompt.module';
import { RepositoryModule } from '@/repository/repository.module';
import { forwardRef, Module } from '@nestjs/common';
import { RatingsResolver } from './ratings.resolver';
import { RatingsService } from './ratings.service';

@Module({
  providers: [RatingsService, RatingsResolver],
  exports: [RatingsService],
  imports: [
    LlmModule,
    forwardRef(() => ComponentsModule),
    PipelineModule,
    PromptModule,
    ConfigmapModule,
    RepositoryModule,
  ],
})
export class RatingsModule {}
