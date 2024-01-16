import { Module } from '@nestjs/common';
import { PromptLoader } from './prompt.loader';
import { PromptResolver } from './prompt.resolver';
import { PromptService } from './prompt.service';
@Module({
  providers: [PromptResolver, PromptService, PromptLoader],
  exports: [PromptService, PromptLoader],
})
export class PromptModule {}
