import { Paginated } from '@/common/models/paginated.function';
import { Component } from '@/components/models/component.model';
import { Repository } from '@/repository/models/repository.model';
import { Subscription } from '@/subscription/models/subscription.model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { ComponentplanStatus } from './status-componentplan.enum';

@ObjectType()
export class Componentplan {
  @Field(() => ID, { description: '组件名称' })
  name: string;

  /** 创建时间 */
  creationTimestamp: string;

  /** 项目 */
  namespace: string;

  /** 安装版本 */
  version?: string;

  /** 部署名称 */
  releaseName: string;

  /** 状态 */
  @Field(() => ComponentplanStatus, { description: '状态' })
  status?: string;

  @HideField()
  latest?: boolean;

  @HideField()
  approved?: boolean;

  /** 组件 */
  component?: Component;

  @HideField()
  subscriptionName?: string;

  /** 订阅 */
  subscription?: Subscription;

  /** 仓库 */
  repository?: Repository;
}

@ObjectType({ description: '分页' })
export class PaginatedComponentplan extends Paginated(Componentplan) {}
