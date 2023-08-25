import { Paginated } from '@/common/models/paginated.function';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '组件版本' })
class ComponentVersion {
  /** 应用版本 */
  appVersion?: string;

  /** 创建时间 */
  createdAt?: string;

  /** 已废弃 */
  deprecated?: boolean;

  /** digest */
  digest?: string;

  /** 更新时间 */
  updatedAt?: string;

  /** Chart版本 */
  version?: string;
}

@ObjectType({ description: '组件维护者' })
class ComponentMaintainer {
  email?: string;
  name?: string;
  url?: string;
}

@ObjectType({ description: '组件' })
export class Component {
  @Field(() => ID, { description: '组件名称' })
  name: string;

  /** 仓库名称 */
  chartName: string;

  /** 描述 */
  description?: string;

  /** 创建时间 */
  creationTimestamp?: string;

  /** 已废弃 */
  deprecated?: boolean;

  /** icon */
  icon?: string;

  /** 关键词 */
  keywords?: string[];

  /** 源代码 */
  sources?: string[];

  /** 组件官网 */
  home?: string;

  /** 版本 */
  versions?: ComponentVersion[];

  /** 维护者 */
  maintainers?: ComponentMaintainer[];

  /** 最近更新时间 */
  updatedAt?: string;
}

@ObjectType({ description: '分页' })
export class PaginatedComponent extends Paginated(Component) {}
