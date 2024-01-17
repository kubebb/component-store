import { Auth } from '@/common/decorators/auth.decorator';
import { JwtAuth } from '@/types';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Prompt } from './models/prompt.model';
import { PromptService } from './prompt.service';
@Resolver(() => Prompt)
export class PromptResolver {
  constructor(private readonly promptService: PromptService) {}
  @Query(() => Prompt, { description: `prompt详情` })
  async prompt(
    @Auth()
    auth: JwtAuth,
    @Args('name')
    name: string,
    @Args('namespace')
    namespace: string,
    @Args('cluster', {
      nullable: true,
      description: `集群下的资源，不传则为默认集群`,
    })
    cluster: string
  ): Promise<Prompt> {
    return this.promptService.get(auth, name, namespace, cluster);
  }

  @Query(() => [Prompt], { description: 'prompt列表' })
  async prompts(
    @Auth() auth: JwtAuth,
    @Args('namespace', { nullable: true }) namespace: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Prompt[]> {
    return this.promptService.getPromptList(auth, namespace, cluster);
  }
}
