import { Auth } from '@/common/decorators/auth.decorator';
import { JwtAuth } from '@/types';
import { Query, Resolver } from '@nestjs/graphql';
import { ComponentsService } from './components.service';
import { Component } from './models/component.model';

@Resolver(() => Component)
export class ComponentsResolver {
  constructor(private readonly componentsService: ComponentsService) {}

  @Query(() => [Component], { description: '组件列表' })
  async components(@Auth() auth: JwtAuth): Promise<Component[]> {
    return this.componentsService.listComponents(auth);
  }
}
