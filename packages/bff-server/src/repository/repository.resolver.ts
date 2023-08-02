import { Auth } from '@/common/decorators/auth.decorator';
import { JwtAuth } from '@/types';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateRepositoryInput } from './dto/create-repository.input';
import { RepostoryArgs } from './dto/repository.args';
import { UpdateRepositoryInput } from './dto/update-repository.input';
import { PaginatedRepository, Repository } from './models/repository.model';
import { RepositoryService } from './repository.service';

@Resolver(() => Repository)
export class RepositoryResolver {
  constructor(private readonly repositoryService: RepositoryService) {}

  @Query(() => PaginatedRepository, { description: '组件仓库列表' })
  async repositories(
    @Auth() auth: JwtAuth,
    @Args() args: RepostoryArgs
  ): Promise<PaginatedRepository> {
    return this.repositoryService.getRepositoriesPaged(auth, args);
  }

  @Query(() => Repository, { description: '组件仓库详情' })
  async repository(@Auth() auth: JwtAuth, @Args('name') name: string): Promise<Repository> {
    return this.repositoryService.getRepository(auth, name);
  }

  @Mutation(() => Repository)
  async repositoryCreate(
    @Auth() auth: JwtAuth,
    @Args('repository') repository: CreateRepositoryInput
  ): Promise<Repository> {
    return this.repositoryService.create(auth, repository);
  }

  @Mutation(() => Repository)
  async repositoryUpdate(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('repository') repository: UpdateRepositoryInput
  ) {
    return this.repositoryService.update(auth, name, repository);
  }

  @Mutation(() => Boolean, { description: '删除组件仓库' })
  async repositoryRemove(@Auth() auth: JwtAuth, @Args('name') name: string): Promise<boolean> {
    return this.repositoryService.remove(auth, name);
  }
}
