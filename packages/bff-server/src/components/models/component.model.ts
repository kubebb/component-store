import { Paginated } from '@/common/models/paginated.function';
import { Repository } from '@/repository/models/repository.model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';
import { ComponentSource } from './component-source.enum';
import { ComponentStatus } from './component-status.enum';

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

  /** urls */
  urls?: string[];
}

@ObjectType({ description: '组件维护者' })
class ComponentMaintainer {
  email?: string;
  name?: string;
  url?: string;
}

@ObjectType({ description: 'Chart 信息-镜像' })
class ComponentChartImage {
  image?: string;
  id: string;
  registry?: string;
  path?: string;
  name?: string;
  tag?: string;
  matched?: boolean;
}

@ObjectType({ description: 'Chart 信息' })
export class ComponentChart {
  /** Values.yaml */
  valuesYaml?: string;

  /** manifest.images */
  images?: string[];

  /** README */
  readme?: string;

  @HideField()
  imagesFaked?: ComponentChartImage[];

  /** 镜像替换可选项 */
  imagesOptions?: ComponentChartImage[];
}

@ObjectType({ description: '组件' })
export class Component {
  @Field(() => ID, { description: '组件名称' })
  name: string;

  namespace: string;

  @HideField()
  namespacedName: string;

  /** Chart 名称 */
  chartName: string;

  /** 展示名 */
  displayName?: string;

  /** 所属仓库 */
  repository: string;

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

  /** 源代码地址 */
  sources?: string[];

  /** 组件官网 */
  home?: string;

  /** 版本 */
  versions?: ComponentVersion[];

  /** 维护者 */
  maintainers?: ComponentMaintainer[];

  /** 最近更新时间 */
  updatedAt?: string;

  /** 状态 */
  @Field(() => ComponentStatus, { description: '状态' })
  status?: string;

  /** 代码来源 */
  @Field(() => ComponentSource, { description: '代码来源' })
  source?: string;

  /** 最新版本 */
  latestVersion?: string;

  /** 指定租户 */
  restrictedTenants?: string[];

  /** 指定项目 */
  restrictedNamespaces?: string[];

  /** 组件类别 */
  classification?: string;

  /** 是否显示新版本 */
  isNewer?: boolean;

  chart?: ComponentChart;

  /** 所属仓库 */
  repositoryCR?: Repository;
}

@ObjectType({ description: '分页' })
export class PaginatedComponent extends Paginated(Component) {}
