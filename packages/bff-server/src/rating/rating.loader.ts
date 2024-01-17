import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'src/common/dataloader';
import { JwtAuth } from 'src/types';
import { Rating } from './models/ratings.model';
import { RatingsService } from './ratings.service';

@Injectable({ scope: Scope.REQUEST })
export class RatingLoader extends OrderedNestDataLoader<Rating['namespacedName'], Rating> {
  constructor(private readonly ratingsService: RatingsService) {
    super();
  }

  protected getOptions = (auth: JwtAuth) => ({
    propertyKey: 'namespacedName',
    query: (keys: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_name, _repository, namespace, cluster] = keys[0]?.split('_');
      return this.ratingsService.getRatingList(auth, namespace, cluster || undefined);
    },
  });
}
