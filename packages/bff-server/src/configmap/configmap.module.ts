import { Module } from '@nestjs/common';
import { ConfigmapService } from './configmap.service';

@Module({
  providers: [ConfigmapService],
  exports: [ConfigmapService],
})
export class ConfigmapModule {}
