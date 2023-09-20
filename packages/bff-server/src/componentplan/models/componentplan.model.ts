import { Paginated } from '@/common/models/paginated.function';
import { Component } from '@/components/models/component.model';
import { Repository } from '@/repository/models/repository.model';
import { Subscription } from '@/subscription/models/subscription.model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { ExportComponentplanStatus } from './export-status-componentplan.enum';

@ObjectType()
class ComponentplanImage {
  /** 名称（如：ghcr.io/helm/chartmuseum:v0.16.0 或 ghcr.io/helm/chartmuseum） */
  name?: string;
  /** 替换名称（如：172.22.50.223/kubebb/chartmuseum） */
  newName?: string;
  /** 替换tag（如：v0.16.0） */
  newTag?: string;
  digest?: string;
}

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
  @Field(() => ExportComponentplanStatus, { nullable: true, description: '状态' })
  status?: string;

  /** 当前安装 */
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

  /** 覆盖镜像 */
  images?: ComponentplanImage[];

  @HideField()
  configmap?: string;

  /** 配置文件values.yaml */
  valuesYaml?: string;
}

@ObjectType({ description: '分页' })
export class PaginatedComponentplan extends Paginated(Componentplan) {}
