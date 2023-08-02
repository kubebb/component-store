import { Module } from '@nestjs/common';
import { SecretService } from './secret.service';

@Module({
  providers: [SecretService],
  exports: [SecretService],
})
export class SecretModule {}
