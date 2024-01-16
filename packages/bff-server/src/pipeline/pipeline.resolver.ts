import { Auth } from '@/common/decorators/auth.decorator';
import { JwtAuth } from '@/types';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Pipeline } from './models/pipeline.model';
import { PipelineService } from './pipeline.service';
@Resolver(() => Pipeline)
export class PipelineResolver {
  constructor(private readonly pipelineService: PipelineService) {}
  @Query(() => [Pipeline], { description: 'pipelines列表' })
  async pipelines(
    @Auth() auth: JwtAuth,
    @Args('namespace') namespace: string,
    @Args('cluster', {
      nullable: true,
      description: `集群下的资源，不传则为默认集群`,
    })
    cluster: string
  ): Promise<Pipeline[]> {
    return this.pipelineService.list(auth, namespace, cluster);
  }
}
