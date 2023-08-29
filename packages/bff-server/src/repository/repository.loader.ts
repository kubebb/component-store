import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'src/common/dataloader';
import { JwtAuth } from 'src/types';
import { Repository } from './models/repository.model';
import { RepositoryService } from './repository.service';

@Injectable({ scope: Scope.REQUEST })
export class RepositoryLoader extends OrderedNestDataLoader<Repository['name'], Repository> {
  constructor(private readonly repositoryService: RepositoryService) {
    super();
  }

  protected getOptions = (auth: JwtAuth) => ({
    propertyKey: 'name',
    query: () => this.repositoryService.getRepositories(auth),
  });
}
