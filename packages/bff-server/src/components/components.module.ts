import { RepositoryModule } from '@/repository/repository.module';
import { Module } from '@nestjs/common';
import { ComponentsResolver } from './components.resolver';
import { ComponentsService } from './components.service';

@Module({
  providers: [ComponentsService, ComponentsResolver],
  imports: [RepositoryModule],
})
export class ComponentsModule {}
