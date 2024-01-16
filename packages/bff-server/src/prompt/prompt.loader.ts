import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'src/common/dataloader';
import { JwtAuth } from 'src/types';
import { Prompt } from './models/prompt.model';
import { PromptService } from './prompt.service';

@Injectable({ scope: Scope.REQUEST })
export class PromptLoader extends OrderedNestDataLoader<Prompt['namespacedName'], Prompt> {
  constructor(private readonly promptService: PromptService) {
    super();
  }

  protected getOptions = (auth: JwtAuth) => ({
    propertyKey: 'namespacedName',
    query: async (keys: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_prompt, namespace, cluster] = keys[0]?.split('_');
      return this.promptService.getPromptList(auth, namespace, cluster || undefined);
    },
  });
}
