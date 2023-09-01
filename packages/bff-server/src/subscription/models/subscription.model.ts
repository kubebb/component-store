import { Paginated } from '@/common/models/paginated.function';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '组件订阅' })
export class Subscription {
  @Field(() => ID, { description: 'name' })
  name: string;

  /** 组件名称 */
  chartName?: string;

  /** 组件最新版本 */
  latestVersion?: string;

  /** 组件最近更新时间 */
  updatedAt?: string;

  /** 所属组件仓库 */
  repository: string;

  /** 项目 */
  namespace: string;

  /** 订阅时间 */
  creationTimestamp: string;
}

@ObjectType({ description: '分页' })
export class PaginatedSubscription extends Paginated(Subscription) {}
