import { SecretModule } from '@/secret/secret.module';
import { Module } from '@nestjs/common';
import { RepositoryResolver } from './repository.resolver';
import { RepositoryService } from './repository.service';

@Module({
  providers: [RepositoryResolver, RepositoryService],
  imports: [SecretModule],
})
export class RepositoryModule {}
