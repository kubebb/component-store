import { PaginationArgs } from '@/common/models/pagination.args';
import { SortDirection } from '@/common/models/sort-direction.enum';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SubscriptionArgs extends PaginationArgs {
  /** 组件名称 */
  chartName?: string;

  /** 组件仓库 */
  repository?: string;

  /** 项目 */
  namespace: string;

  /** 有新版本的组件 */
  isNewer?: boolean;

  /** 排序方向 */
  @Field(() => SortDirection, { description: '排序方向' })
  sortDirection?: SortDirection;

  /** 排序字段 */
  @Field(() => String, { description: '排序字段' })
  sortField?: 'creationTimestamp';

  /** 集群（不传则为默认集群） */
  cluster?: string;
}
