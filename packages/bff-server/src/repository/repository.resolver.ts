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

  @Query(() => PaginatedRepository, { description: '组件仓库列表（分页）' })
  async repositories(
    @Auth() auth: JwtAuth,
    @Args() args: RepostoryArgs
  ): Promise<PaginatedRepository> {
    return this.repositoryService.getRepositoriesPaged(auth, args);
  }

  @Query(() => [Repository], { description: '组件仓库列表' })
  async repositoriesAll(@Auth() auth: JwtAuth): Promise<Repository[]> {
    return this.repositoryService.getRepositories(auth);
  }

  @Query(() => Repository, { description: '组件仓库详情' })
  async repository(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Repository> {
    return this.repositoryService.getRepository(auth, name, cluster);
  }

  @Mutation(() => Repository, { description: '创建仓库' })
  async repositoryCreate(
    @Auth() auth: JwtAuth,
    @Args('repository') repository: CreateRepositoryInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<Repository> {
    return this.repositoryService.create(auth, repository, cluster);
  }

  @Mutation(() => Repository, { description: '更新仓库' })
  async repositoryUpdate(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('repository') repository: UpdateRepositoryInput,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ) {
    return this.repositoryService.update(auth, name, repository, cluster);
  }

  @Mutation(() => Boolean, { description: '删除组件仓库' })
  async repositoryRemove(
    @Auth() auth: JwtAuth,
    @Args('name') name: string,
    @Args('cluster', {
      nullable: true,
      description: '集群下的资源，不传则为默认集群',
    })
    cluster: string
  ): Promise<boolean> {
    return this.repositoryService.remove(auth, name, cluster);
  }
}
