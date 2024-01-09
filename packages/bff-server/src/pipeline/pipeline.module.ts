import { Module } from '@nestjs/common';
import { PipelineResolver } from './pipeline.resolver';
import { PipelineService } from './pipeline.service';
@Module({
  providers: [PipelineResolver, PipelineService],
  exports: [PipelineService],
})
export class PipelineModule {}
