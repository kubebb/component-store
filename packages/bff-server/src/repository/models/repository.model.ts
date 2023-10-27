import { Paginated } from '@/common/models/paginated.function';
import { AnyObj } from '@/types';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { RepositoryFilterOperation } from './repository-filter-operation';
import { RepositoryStatus } from './repository-status.enum';
import { RepositoryType } from './repository-type.enum';

@ObjectType()
export class Repository {
  @Field(() => ID, { description: 'name' })
  name: string;

  @HideField()
  namespacedName: string;

  /** 类型 */
  repositoryType?: RepositoryType;

  /** URL */
  url: string;

  /** 当前状态 */
  status: RepositoryStatus;

  /** 状态为失败的原因 */
  reason?: string;

  /** 更新时间 */
  creationTimestamp: string;

  /** 最近同步时间 */
  lastSuccessfulTime?: string;

  @HideField()
  intervalSeconds?: number;

  /** https验证 */
  insecure?: boolean;

  @HideField()
  authSecret?: string;

  @HideField()
  labels?: AnyObj;

  /** 用户名(base64) */
  username?: string;

  /** 密码(base64) */
  password?: string;

  /** 组件更新 */
  pullStategy?: RepositoryPullStategy;

  /** 组件过滤 */
  filter?: RepositoryFilter[];

  /** 镜像仓库替换 */
  imageOverride?: RepositoryImageOverride[];
}

@ObjectType({ description: '分页' })
export class PaginatedRepository extends Paginated(Repository) {}

@ObjectType({ description: '组件更新' })
class RepositoryPullStategy {
  /** 间隔时间 */
  intervalSeconds?: number;

  /** 重试次数 */
  retry?: number;

  /** 超时时间 */
  timeoutSeconds?: number;
}

@ObjectType({ description: '组件过滤' })
class RepositoryFilter {
  /** 组件名称 */
  name?: string;

  /** 保留废弃版本 */
  keepDeprecated?: boolean;

  /** 操作意向 */
  @Field(() => RepositoryFilterOperation, { description: '操作意向' })
  operation?: string;

  /** 正则 */
  regexp?: string;

  /** 版本号 */
  versions?: string[];

  /** 版本表达式 */
  versionConstraint?: string;
}

@ObjectType({ description: '镜像仓库替换' })
class RepositoryImageOverride {
  /** 新域名 */
  newRegistry?: string;

  /** 原域名 */
  registry?: string;

  /** 原仓库组 */
  path?: string;

  /** 新仓库组 */
  newPath?: string;
}
