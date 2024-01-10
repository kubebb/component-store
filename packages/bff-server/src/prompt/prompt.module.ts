import { Module } from '@nestjs/common';
import { PromptResolver } from './prompt.resolver';
import { PromptService } from './prompt.service';
@Module({
  providers: [PromptResolver, PromptService],
  exports: [PromptService],
})
export class PromptModule {}
