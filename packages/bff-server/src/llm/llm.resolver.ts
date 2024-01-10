import { Auth } from '@/common/decorators/auth.decorator';
import { JwtAuth } from '@/types';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { LlmService } from './llm.service';
import { Llm } from './models/llm.model';
@Resolver(() => Llm)
export class LlmResolver {
  constructor(private readonly llmService: LlmService) {}
  @Query(() => Llm, { description: `llm详情` })
  async llm(
    @Auth()
    auth: JwtAuth,
    @Args('name')
    name: string,
    @Args('namespace', { nullable: true })
    namespace: string,
    @Args('cluster', {
      nullable: true,
      description: `集群下的资源，不传则为默认集群`,
    })
    cluster: string
  ): Promise<Llm> {
    return this.llmService.get(auth, name, namespace, cluster);
  }
}
