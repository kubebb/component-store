import { ConfigmapModule } from '@/configmap/configmap.module';
import { RepositoryModule } from '@/repository/repository.module';
import { SecretModule } from '@/secret/secret.module';
import { Module } from '@nestjs/common';
import { ComponentsResolver } from './components.resolver';
import { ComponentsService } from './components.service';

@Module({
  providers: [ComponentsService, ComponentsResolver],
  exports: [ComponentsService],
  imports: [RepositoryModule, SecretModule, ConfigmapModule],
})
export class ComponentsModule {}
