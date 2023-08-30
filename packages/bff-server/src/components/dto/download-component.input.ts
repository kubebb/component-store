import { InputType } from '@nestjs/graphql';

@InputType({ description: '下载组件' })
export class DownloadComponentInput {
  /** 组件仓库 */
  repository: string;

  /** Chart名称 */
  chartName: string;

  /** Chart版本 */
  version: string;
}
