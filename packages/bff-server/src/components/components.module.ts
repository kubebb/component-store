import { ConfigmapModule } from '@/configmap/configmap.module';
import { PromptModule } from '@/prompt/prompt.module';
import { RatingsModule } from '@/rating/ratings.module';
import { RepositoryModule } from '@/repository/repository.module';
import { SecretModule } from '@/secret/secret.module';
import { forwardRef, Module } from '@nestjs/common';
import { ComponentsResolver } from './components.resolver';
import { ComponentsService } from './components.service';

@Module({
  providers: [ComponentsService, ComponentsResolver],
  exports: [ComponentsService],
  imports: [
    forwardRef(() => RatingsModule),
    PromptModule,
    RepositoryModule,
    SecretModule,
    ConfigmapModule,
  ],
})
export class ComponentsModule {}
