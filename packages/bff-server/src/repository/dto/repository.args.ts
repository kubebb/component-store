import { PaginationArgs } from '@/common/models/pagination.args';
import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class RepostoryArgs extends PaginationArgs {
  /** 组件仓库名称 */
  name?: string;
}
