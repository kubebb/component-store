import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/models/pagination.args';

@ArgsType()
export class RatingsArgs extends PaginationArgs {
  /** 组件名称 */
  name?: string;

  /** 项目 */
  namespace?: string;

  /** 版本 */
  version: string;

  /** 集群 */
  cluster?: string;
}
