import { SecretModule } from '@/secret/secret.module';
import { Module } from '@nestjs/common';
import { RepositoryLoader } from './repository.loader';
import { RepositoryResolver } from './repository.resolver';
import { RepositoryService } from './repository.service';

@Module({
  providers: [RepositoryResolver, RepositoryService, RepositoryLoader],
  exports: [RepositoryService, RepositoryLoader],
  imports: [SecretModule],
})
export class RepositoryModule {}
