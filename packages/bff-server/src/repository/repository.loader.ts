import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'src/common/dataloader';
import { JwtAuth } from 'src/types';
import { Repository } from './models/repository.model';
import { RepositoryService } from './repository.service';

@Injectable({ scope: Scope.REQUEST })
export class RepositoryLoader extends OrderedNestDataLoader<
  Repository['namespacedName'],
  Repository
> {
  constructor(private readonly repositoryService: RepositoryService) {
    super();
  }

  protected getOptions = (auth: JwtAuth) => ({
    propertyKey: 'namespacedName',
    query: (keys: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, namespace, cluster] = keys[0]?.split('_');
      return this.repositoryService.getRepositories(auth, {}, cluster || undefined);
    },
  });
}
