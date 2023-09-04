import { RepositoryModule } from '@/repository/repository.module';
import { Module } from '@nestjs/common';
import { ComponentLoader } from './components.loader';
import { ComponentsResolver } from './components.resolver';
import { ComponentsService } from './components.service';

@Module({
  providers: [ComponentsService, ComponentsResolver, ComponentLoader],
  exports: [ComponentsService, ComponentLoader],
  imports: [RepositoryModule],
})
export class ComponentsModule {}
