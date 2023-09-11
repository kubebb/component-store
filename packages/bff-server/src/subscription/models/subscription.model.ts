import { Paginated } from '@/common/models/paginated.function';
import { Component } from '@/components/models/component.model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { InstallMethod } from './installmethod.enum';

@ObjectType({ description: '组件订阅' })
export class Subscription {
  @Field(() => ID, { description: 'name' })
  name: string;

  @HideField()
  namespacedName: string;

  /** 组件名称 */
  chartName?: string;

  /** 部署名称 */
  releaseName?: string;

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

  /** 更新方式 */
  @Field(() => InstallMethod, { description: '更新方式' })
  componentPlanInstallMethod?: string;

  /** 组件 */
  component: Component;
}

@ObjectType({ description: '分页' })
export class PaginatedSubscription extends Paginated(Subscription) {}
