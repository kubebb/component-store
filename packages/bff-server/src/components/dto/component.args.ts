import { SortDirection } from '@/common/models/sort-direction.enum';
import { ArgsType, Field } from '@nestjs/graphql';
import { PaginationArgs } from 'src/common/models/pagination.args';
import { ComponentSource } from '../models/component-source.enum';

@ArgsType()
export class ComponentArgs extends PaginationArgs {
  /** 组件名称 */
  name?: string;

  /** Chart名称 */
  chartName?: string;

  /** 关键词 */
  keyword?: string;

  /** 来源（多选） */
  source?: ComponentSource;

  /** 当前状态（多选） */

  /** 排序方向 */
  @Field(() => SortDirection, { description: '排序方向' })
  sortDirection?: SortDirection;

  /** 排序字段 */
  @Field(() => String, { description: '排序字段' })
  sortField?: 'updatedAt';

  /** 集群（不传则为默认集群） */
  cluster?: string;

  /** 存在新版本 */
  isNewer?: boolean;
}
