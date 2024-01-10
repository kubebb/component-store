import { Module } from '@nestjs/common';
import { LlmResolver } from './llm.resolver';
import { LlmService } from './llm.service';
@Module({
  providers: [LlmResolver, LlmService],
  exports: [LlmService],
})
export class LlmModule {}
