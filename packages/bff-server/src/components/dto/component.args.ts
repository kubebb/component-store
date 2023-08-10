import { ArgsType } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/models/pagination.args';

@ArgsType()
export class ComponentArgs extends PaginationArgs {
  /** 组件名称 */
  name?: string;

  /** Chart名称 */
  chartName?: string;
}
