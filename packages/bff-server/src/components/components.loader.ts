import { Injectable, Scope } from '@nestjs/common';
import { OrderedNestDataLoader } from 'src/common/dataloader';
import { JwtAuth } from 'src/types';
import { ComponentsService } from './components.service';
import { Component } from './models/component.model';

@Injectable({ scope: Scope.REQUEST })
export class ComponentLoader extends OrderedNestDataLoader<Component['namespacedName'], Component> {
  constructor(private readonly componentsService: ComponentsService) {
    super();
  }

  protected getOptions = (auth: JwtAuth) => ({
    propertyKey: 'namespacedName',
    query: (keys: string[]) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const [_, namespace, cluster] = keys[0]?.split('_');
      return this.componentsService.listComponents(auth, cluster || undefined);
    },
  });
}
