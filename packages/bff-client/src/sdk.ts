import { GraphQLClient } from 'graphql-request';
import { GraphQLClientRequestHeaders } from 'graphql-request/build/cjs/types';
import { ClientError } from 'graphql-request/src/types';
import gql from 'graphql-tag';
import { Key as SWRKeyInterface, SWRConfiguration as SWRConfigInterface } from 'swr';
import useSWRInfinite, { SWRInfiniteConfiguration } from 'swr/infinite';
import useSWR from './useSWR';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = {
  [_ in K]?: never;
};
export type Incremental<T> =
  | T
  | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string };
  String: { input: string; output: string };
  Boolean: { input: boolean; output: boolean };
  Int: { input: number; output: number };
  Float: { input: number; output: number };
  Date: { input: any; output: any };
  JSON: { input: any; output: any };
  JSONObject: { input: any; output: any };
  Upload: { input: any; output: any };
};

/** 组件 */
export type Component = {
  __typename?: 'Component';
  chart?: Maybe<ComponentChart>;
  /** Chart 名称 */
  chartName: Scalars['String']['output'];
  /** 创建时间 */
  creationTimestamp?: Maybe<Scalars['String']['output']>;
  /** 已废弃 */
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  /** 描述 */
  description?: Maybe<Scalars['String']['output']>;
  /** 展示名 */
  displayName?: Maybe<Scalars['String']['output']>;
  /** 组件官网 */
  home?: Maybe<Scalars['String']['output']>;
  /** icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** 是否显示新版本 */
  isNewer?: Maybe<Scalars['Boolean']['output']>;
  /** 关键词 */
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  /** 最新版本 */
  latestVersion?: Maybe<Scalars['String']['output']>;
  /** 维护者 */
  maintainers?: Maybe<Array<ComponentMaintainer>>;
  /** 组件名称 */
  name: Scalars['ID']['output'];
  namespace: Scalars['String']['output'];
  /** 所属仓库 */
  repository: Scalars['String']['output'];
  /** 所属仓库 */
  repositoryCR?: Maybe<Repository>;
  /** 代码来源 */
  source?: Maybe<ComponentSource>;
  /** 源代码地址 */
  sources?: Maybe<Array<Scalars['String']['output']>>;
  /** 状态 */
  status?: Maybe<ComponentStatus>;
  /** 最近更新时间 */
  updatedAt?: Maybe<Scalars['String']['output']>;
  /** 版本 */
  versions?: Maybe<Array<ComponentVersion>>;
};

/** 组件 */
export type ComponentChartArgs = {
  version: Scalars['String']['input'];
};

/** Chart 信息 */
export type ComponentChart = {
  __typename?: 'ComponentChart';
  images?: Maybe<Array<Scalars['String']['output']>>;
  valuesYaml?: Maybe<Scalars['String']['output']>;
};

export type ComponentEdge = {
  __typename?: 'ComponentEdge';
  cursor: Scalars['String']['output'];
  node: Component;
};

/** 组件维护者 */
export type ComponentMaintainer = {
  __typename?: 'ComponentMaintainer';
  email?: Maybe<Scalars['String']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

/** 组件来源 */
export enum ComponentSource {
  /** 官方 */
  Official = 'official',
}

/** 组件状态 */
export enum ComponentStatus {
  /** 正常 */
  Ready = 'ready',
  /** 同步中 */
  Syncing = 'syncing',
}

/** 组件版本 */
export type ComponentVersion = {
  __typename?: 'ComponentVersion';
  /** 应用版本 */
  appVersion?: Maybe<Scalars['String']['output']>;
  /** 创建时间 */
  createdAt?: Maybe<Scalars['String']['output']>;
  /** 已废弃 */
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  /** digest */
  digest?: Maybe<Scalars['String']['output']>;
  /** 更新时间 */
  updatedAt?: Maybe<Scalars['String']['output']>;
  /** urls */
  urls?: Maybe<Array<Scalars['String']['output']>>;
  /** Chart版本 */
  version?: Maybe<Scalars['String']['output']>;
};

export type Componentplan = {
  __typename?: 'Componentplan';
  /** 组件 */
  component?: Maybe<Component>;
  /** 创建时间 */
  creationTimestamp: Scalars['String']['output'];
  /** 历史版本 */
  history?: Maybe<Array<Componentplan>>;
  /** 覆盖镜像 */
  images?: Maybe<Array<ComponentplanImage>>;
  /** 当前安装 */
  latest?: Maybe<Scalars['Boolean']['output']>;
  /** 组件名称 */
  name: Scalars['ID']['output'];
  /** 项目 */
  namespace: Scalars['String']['output'];
  /** 部署名称 */
  releaseName: Scalars['String']['output'];
  /** 仓库 */
  repository?: Maybe<Repository>;
  /** 状态 */
  status?: Maybe<ExportComponentplanStatus>;
  /** 订阅 */
  subscription?: Maybe<Subscription>;
  /** 配置文件values.yaml */
  valuesYaml?: Maybe<Scalars['String']['output']>;
  /** 安装版本 */
  version?: Maybe<Scalars['String']['output']>;
};

export type ComponentplanEdge = {
  __typename?: 'ComponentplanEdge';
  cursor: Scalars['String']['output'];
  node: Componentplan;
};

export type ComponentplanImage = {
  __typename?: 'ComponentplanImage';
  digest?: Maybe<Scalars['String']['output']>;
  /** 名称（如：ghcr.io/helm/chartmuseum:v0.16.0 或 ghcr.io/helm/chartmuseum） */
  name?: Maybe<Scalars['String']['output']>;
  /** 替换名称（如：172.22.50.223/kubebb/chartmuseum） */
  newName?: Maybe<Scalars['String']['output']>;
  /** 替换tag（如：v0.16.0） */
  newTag?: Maybe<Scalars['String']['output']>;
};

export type ComponentplanImageInput = {
  digest?: InputMaybe<Scalars['String']['input']>;
  /** 名称（如：ghcr.io/helm/chartmuseum:v0.16.0 或 ghcr.io/helm/chartmuseum） */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 替换名称（如：172.22.50.223/kubebb/chartmuseum） */
  newName?: InputMaybe<Scalars['String']['input']>;
  /** 替换tag（如：v0.16.0） */
  newTag?: InputMaybe<Scalars['String']['input']>;
};

/** 上传组件 */
export type CreateComponentInput = {
  /** 组件helm包 */
  file: Scalars['Upload']['input'];
  /** 组件仓库 */
  repository: Scalars['String']['input'];
};

export type CreateComponentplanInput = {
  /** 组件名称 */
  chartName: Scalars['String']['input'];
  /** 更新方式 */
  componentPlanInstallMethod: InstallMethod;
  /** 替换镜像 */
  images?: InputMaybe<Array<ComponentplanImageInput>>;
  /** 部署名称 */
  releaseName: Scalars['String']['input'];
  /** 组件仓库 */
  repository: Scalars['String']['input'];
  /** 自动更新时间（Cron 格式） */
  schedule?: InputMaybe<Scalars['String']['input']>;
  /** 配置文件 */
  valuesYaml?: InputMaybe<Scalars['String']['input']>;
  /** 版本 */
  version: Scalars['String']['input'];
};

export type CreateRepositoryInput = {
  /** ca.pem（根证书） */
  cadata?: InputMaybe<Scalars['Upload']['input']>;
  /** client.pem（客户端证书） */
  certdata?: InputMaybe<Scalars['Upload']['input']>;
  /** 组件过滤 */
  filter?: InputMaybe<Array<RepositoryFilterInput>>;
  /** 镜像仓库替换 */
  imageOverride?: InputMaybe<Array<RepositoryImageOverrideInput>>;
  /** https验证 */
  insecure?: InputMaybe<Scalars['Boolean']['input']>;
  /** client.key（客户端私钥） */
  keydata?: InputMaybe<Scalars['Upload']['input']>;
  /** 名称，规则：小写字母、数字、“-”，开头和结尾只能是字母或数字`（[a-z0-9]([-a-z0-9]*[a-z0-9])?）` */
  name: Scalars['String']['input'];
  /** 密码(base64) */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 组件更新 */
  pullStategy?: InputMaybe<RepositoryPullStategyInput>;
  /** 类型 */
  repositoryType?: InputMaybe<Scalars['String']['input']>;
  /** URL */
  url: Scalars['String']['input'];
  /** 用户名(base64) */
  username?: InputMaybe<Scalars['String']['input']>;
};

export type CreateSubscriptionInput = {
  /** 组件name（如 kubebb.minio） */
  name: Scalars['String']['input'];
  /** 项目 */
  namespace: Scalars['String']['input'];
};

/** 删除组件 */
export type DeleteComponentInput = {
  /** Chart名称 */
  chartName: Scalars['String']['input'];
  /** 组件仓库 */
  repository: Scalars['String']['input'];
  /** 删除的版本 */
  versions: Array<Scalars['String']['input']>;
};

/** 下载组件 */
export type DownloadComponentInput = {
  /** Chart名称 */
  chartName: Scalars['String']['input'];
  /** 组件仓库 */
  repository: Scalars['String']['input'];
  /** Chart版本 */
  version: Scalars['String']['input'];
};

/** 组件状态 */
export enum ExportComponentplanStatus {
  /** 安装失败 */
  InstallFailed = 'InstallFailed',
  /** 安装成功 */
  InstallSuccess = 'InstallSuccess',
  /** 安装中 */
  Installing = 'Installing',
  /** 卸载失败 */
  UninstallFailed = 'UninstallFailed',
  /** 卸载中 */
  Uninstalling = 'Uninstalling',
  /** 未知 */
  Unknown = 'Unknown',
}

/** 组件更新方式 */
export enum InstallMethod {
  /** 自动 */
  Auto = 'auto',
  /** 手动 */
  Manual = 'manual',
}

export type Mutation = {
  __typename?: 'Mutation';
  /** 删除组件 */
  componentDelete: Scalars['Boolean']['output'];
  /** 下载组件 */
  componentDownload: Scalars['String']['output'];
  /** 发布组件 */
  componentUpload: Scalars['Boolean']['output'];
  /** 安装组件创建 */
  componentplanCreate: Scalars['Boolean']['output'];
  /** 安装组件删除 */
  componentplanRemove: Scalars['Boolean']['output'];
  /** 安装组件回滚 */
  componentplanRollback: Scalars['Boolean']['output'];
  /** 安装组件更新 */
  componentplanUpdate: Scalars['Boolean']['output'];
  /** 创建仓库 */
  repositoryCreate: Repository;
  /** 删除组件仓库 */
  repositoryRemove: Scalars['Boolean']['output'];
  /** 更新仓库 */
  repositoryUpdate: Repository;
  /** 订阅 */
  subscriptionCreate: Scalars['Boolean']['output'];
  /** 取消订阅 */
  subscriptionDelete: Scalars['Boolean']['output'];
  /** 取消订阅（同component） */
  subscriptionRemove: Scalars['Boolean']['output'];
};

export type MutationComponentDeleteArgs = {
  chart: DeleteComponentInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
};

export type MutationComponentDownloadArgs = {
  chart: DownloadComponentInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
};

export type MutationComponentUploadArgs = {
  chart: CreateComponentInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
};

export type MutationComponentplanCreateArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  componentplan: CreateComponentplanInput;
  namespace: Scalars['String']['input'];
};

export type MutationComponentplanRemoveArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

export type MutationComponentplanRollbackArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

export type MutationComponentplanUpdateArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  componentplan: UpdateComponentplanInput;
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

export type MutationRepositoryCreateArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  repository: CreateRepositoryInput;
};

export type MutationRepositoryRemoveArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type MutationRepositoryUpdateArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  repository: UpdateRepositoryInput;
};

export type MutationSubscriptionCreateArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  subscription: CreateSubscriptionInput;
};

export type MutationSubscriptionDeleteArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

export type MutationSubscriptionRemoveArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  component: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

/** 分页 */
export type PaginatedComponent = {
  __typename?: 'PaginatedComponent';
  edges?: Maybe<Array<ComponentEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  nodes?: Maybe<Array<Component>>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

/** 分页 */
export type PaginatedComponentplan = {
  __typename?: 'PaginatedComponentplan';
  edges?: Maybe<Array<ComponentplanEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  nodes?: Maybe<Array<Componentplan>>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

/** 分页 */
export type PaginatedRepository = {
  __typename?: 'PaginatedRepository';
  edges?: Maybe<Array<RepositoryEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  nodes?: Maybe<Array<Repository>>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

/** 分页 */
export type PaginatedSubscription = {
  __typename?: 'PaginatedSubscription';
  edges?: Maybe<Array<SubscriptionEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  nodes?: Maybe<Array<Subscription>>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** 组件详情 */
  component: Component;
  /** 安装组件详情 */
  componentplan: Componentplan;
  /** 安装组件列表（分页） */
  componentplansPaged: PaginatedComponentplan;
  /** 组件列表（分页） */
  components: PaginatedComponent;
  /** 组件列表 */
  componentsAll: Array<Component>;
  /** 组件仓库列表（分页） */
  repositories: PaginatedRepository;
  /** 组件仓库列表 */
  repositoriesAll: Array<Repository>;
  /** 组件仓库详情 */
  repository: Repository;
  /** 订阅列表 */
  subscriptions: Array<Subscription>;
  /** 订阅列表（分页） */
  subscriptionsPaged: PaginatedSubscription;
};

export type QueryComponentArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type QueryComponentplanArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
};

export type QueryComponentplansPagedArgs = {
  chartName?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
  isNewer?: InputMaybe<Scalars['Boolean']['input']>;
  namespace: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  releaseName?: InputMaybe<Scalars['String']['input']>;
  repository?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type QueryComponentsArgs = {
  chartName?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
  isNewer?: InputMaybe<Scalars['Boolean']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRepositoriesArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  repositoryTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  statuses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type QueryRepositoryArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type QuerySubscriptionsArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  namespace: Scalars['String']['input'];
};

export type QuerySubscriptionsPagedArgs = {
  chartName?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
  isNewer?: InputMaybe<Scalars['Boolean']['input']>;
  namespace: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  repository?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type Repository = {
  __typename?: 'Repository';
  /** 更新时间 */
  creationTimestamp: Scalars['String']['output'];
  /** 组件过滤 */
  filter?: Maybe<Array<RepositoryFilter>>;
  /** 镜像仓库替换 */
  imageOverride?: Maybe<Array<RepositoryImageOverride>>;
  /** https验证 */
  insecure?: Maybe<Scalars['Boolean']['output']>;
  /** 最近同步时间 */
  lastSuccessfulTime?: Maybe<Scalars['String']['output']>;
  /** name */
  name: Scalars['ID']['output'];
  /** 密码(base64) */
  password?: Maybe<Scalars['String']['output']>;
  /** 组件更新 */
  pullStategy?: Maybe<RepositoryPullStategy>;
  /** 状态为失败的原因 */
  reason?: Maybe<Scalars['String']['output']>;
  /** 类型 */
  repositoryType?: Maybe<Scalars['String']['output']>;
  /** 当前状态 */
  status: RepositoryStatus;
  /** URL */
  url: Scalars['String']['output'];
  /** 用户名(base64) */
  username?: Maybe<Scalars['String']['output']>;
};

export type RepositoryEdge = {
  __typename?: 'RepositoryEdge';
  cursor: Scalars['String']['output'];
  node: Repository;
};

/** 组件过滤 */
export type RepositoryFilter = {
  __typename?: 'RepositoryFilter';
  /** 保留废弃版本 */
  keepDeprecated?: Maybe<Scalars['Boolean']['output']>;
  /** 组件名称 */
  name?: Maybe<Scalars['String']['output']>;
  /** 操作意向 */
  operation?: Maybe<RepositoryFilterOperation>;
  /** 正则 */
  regexp?: Maybe<Scalars['String']['output']>;
  /** 版本表达式 */
  versionConstraint?: Maybe<Scalars['String']['output']>;
  /** 版本号 */
  versions?: Maybe<Array<Scalars['String']['output']>>;
};

/** 组件过滤 */
export type RepositoryFilterInput = {
  /** 保留废弃版本 */
  keepDeprecated?: InputMaybe<Scalars['Boolean']['input']>;
  /** 组件名称 */
  name?: InputMaybe<Scalars['String']['input']>;
  /** 操作意向 */
  operation?: InputMaybe<RepositoryFilterOperation>;
  /** 正则 */
  regexp?: InputMaybe<Scalars['String']['input']>;
  /** 版本表达式 */
  versionConstraint?: InputMaybe<Scalars['String']['input']>;
  /** 版本号 */
  versions?: InputMaybe<Array<Scalars['String']['input']>>;
};

/** 组件仓库状态 */
export enum RepositoryFilterOperation {
  /** 全部过滤 */
  IgnoreAll = 'ignore_all',
  /** 精确过滤 */
  IgnoreExact = 'ignore_exact',
  /** 精确保留 */
  KeepExact = 'keep_exact',
}

/** 镜像仓库替换 */
export type RepositoryImageOverride = {
  __typename?: 'RepositoryImageOverride';
  /** 新仓库组 */
  newPath?: Maybe<Scalars['String']['output']>;
  /** 新域名 */
  newRegistry?: Maybe<Scalars['String']['output']>;
  /** 原仓库组 */
  path?: Maybe<Scalars['String']['output']>;
  /** 原域名 */
  registry?: Maybe<Scalars['String']['output']>;
};

/** 镜像仓库替换 */
export type RepositoryImageOverrideInput = {
  /** 新仓库组 */
  newPath?: InputMaybe<Scalars['String']['input']>;
  /** 新域名 */
  newRegistry?: InputMaybe<Scalars['String']['input']>;
  /** 原仓库组 */
  path?: InputMaybe<Scalars['String']['input']>;
  /** 原域名 */
  registry?: InputMaybe<Scalars['String']['input']>;
};

/** 组件更新 */
export type RepositoryPullStategy = {
  __typename?: 'RepositoryPullStategy';
  /** 间隔时间 */
  intervalSeconds?: Maybe<Scalars['Float']['output']>;
  /** 重试次数 */
  retry?: Maybe<Scalars['Float']['output']>;
  /** 超时时间 */
  timeoutSeconds?: Maybe<Scalars['Float']['output']>;
};

/** 组件更新 */
export type RepositoryPullStategyInput = {
  /** 间隔时间 */
  intervalSeconds?: InputMaybe<Scalars['Float']['input']>;
  /** 重试次数 */
  retry?: InputMaybe<Scalars['Float']['input']>;
  /** 超时时间 */
  timeoutSeconds?: InputMaybe<Scalars['Float']['input']>;
};

/** 组件仓库状态 */
export enum RepositoryStatus {
  /** 异常 */
  Failed = 'failed',
  /** 健康 */
  Health = 'health',
  /** 获取Chart包异常 */
  ReadyFalse = 'ready_false',
  /** 创建中 */
  ReadyTrue = 'ready_true',
  /** 同步失败 */
  SyncedFalse = 'synced_false',
  /** 同步成功 */
  SyncedTrue = 'synced_true',
  /** 同步中 */
  Syncing = 'syncing',
  /** 未知 */
  Unknown = 'unknown',
}

/** 排序方向 */
export enum SortDirection {
  /** 生序 */
  Ascend = 'ascend',
  /** 降序 */
  Descend = 'descend',
}

/** 组件订阅 */
export type Subscription = {
  __typename?: 'Subscription';
  /** 组件名称 */
  chartName?: Maybe<Scalars['String']['output']>;
  /** 组件 */
  component?: Maybe<Component>;
  /** 更新方式 */
  componentPlanInstallMethod?: Maybe<InstallMethod>;
  /** 订阅时间 */
  creationTimestamp: Scalars['String']['output'];
  /** 组件最新版本 */
  latestVersion?: Maybe<Scalars['String']['output']>;
  /** name */
  name: Scalars['ID']['output'];
  /** 项目 */
  namespace: Scalars['String']['output'];
  /** 部署名称 */
  releaseName?: Maybe<Scalars['String']['output']>;
  /** 所属组件仓库 */
  repository: Scalars['String']['output'];
  /** 更新时间 */
  schedule?: Maybe<Scalars['String']['output']>;
  /** 组件最近更新时间 */
  updatedAt?: Maybe<Scalars['String']['output']>;
};

export type SubscriptionEdge = {
  __typename?: 'SubscriptionEdge';
  cursor: Scalars['String']['output'];
  node: Subscription;
};

export type UpdateComponentplanInput = {
  /** 更新方式 */
  componentPlanInstallMethod: InstallMethod;
  /** 替换镜像 */
  images?: InputMaybe<Array<ComponentplanImageInput>>;
  /** 自动更新时间（Cron 格式） */
  schedule?: InputMaybe<Scalars['String']['input']>;
  /** 配置文件 */
  valuesYaml?: InputMaybe<Scalars['String']['input']>;
  /** 版本 */
  version: Scalars['String']['input'];
};

export type UpdateRepositoryInput = {
  /** ca.pem（根证书） */
  cadata?: InputMaybe<Scalars['Upload']['input']>;
  /** client.pem（客户端证书） */
  certdata?: InputMaybe<Scalars['Upload']['input']>;
  /** 组件过滤 */
  filter?: InputMaybe<Array<RepositoryFilterInput>>;
  /** 镜像仓库替换 */
  imageOverride?: InputMaybe<Array<RepositoryImageOverrideInput>>;
  /** https验证 */
  insecure?: InputMaybe<Scalars['Boolean']['input']>;
  /** client.key（客户端私钥） */
  keydata?: InputMaybe<Scalars['Upload']['input']>;
  /** 密码(base64) */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 组件更新 */
  pullStategy?: InputMaybe<RepositoryPullStategyInput>;
  /** 类型 */
  repositoryType?: InputMaybe<Scalars['String']['input']>;
  /** 用户名(base64) */
  username?: InputMaybe<Scalars['String']['input']>;
};

export type GetComponentplansPagedQueryVariables = Exact<{
  namespace: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  releaseName?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
  chartName?: InputMaybe<Scalars['String']['input']>;
  repository?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  isNewer?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GetComponentplansPagedQuery = {
  __typename?: 'Query';
  componentplansPaged: {
    __typename?: 'PaginatedComponentplan';
    hasNextPage: boolean;
    totalCount: number;
    nodes?: Array<{
      __typename?: 'Componentplan';
      name: string;
      releaseName: string;
      creationTimestamp: string;
      namespace: string;
      version?: string | null;
      status?: ExportComponentplanStatus | null;
      component?: {
        __typename?: 'Component';
        name: string;
        chartName: string;
        latestVersion?: string | null;
        repository: string;
        isNewer?: boolean | null;
      } | null;
      subscription?: {
        __typename?: 'Subscription';
        componentPlanInstallMethod?: InstallMethod | null;
      } | null;
    }> | null;
  };
};

export type GetComponentplanQueryVariables = Exact<{
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetComponentplanQuery = {
  __typename?: 'Query';
  componentplan: {
    __typename?: 'Componentplan';
    name: string;
    releaseName: string;
    creationTimestamp: string;
    namespace: string;
    version?: string | null;
    status?: ExportComponentplanStatus | null;
    valuesYaml?: string | null;
    images?: Array<{
      __typename?: 'ComponentplanImage';
      name?: string | null;
      newName?: string | null;
      newTag?: string | null;
    }> | null;
    component?: {
      __typename?: 'Component';
      chartName: string;
      latestVersion?: string | null;
      repository: string;
      versions?: Array<{
        __typename?: 'ComponentVersion';
        version?: string | null;
        deprecated?: boolean | null;
      }> | null;
    } | null;
    subscription?: {
      __typename?: 'Subscription';
      componentPlanInstallMethod?: InstallMethod | null;
      schedule?: string | null;
    } | null;
    repository?: {
      __typename?: 'Repository';
      imageOverride?: Array<{
        __typename?: 'RepositoryImageOverride';
        registry?: string | null;
        newRegistry?: string | null;
        path?: string | null;
        newPath?: string | null;
      }> | null;
    } | null;
  };
};

export type GetComponentplanHistoryQueryVariables = Exact<{
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetComponentplanHistoryQuery = {
  __typename?: 'Query';
  componentplan: {
    __typename?: 'Componentplan';
    namespace: string;
    status?: ExportComponentplanStatus | null;
    releaseName: string;
    component?: { __typename?: 'Component'; chartName: string } | null;
    history?: Array<{
      __typename?: 'Componentplan';
      name: string;
      creationTimestamp: string;
      version?: string | null;
      subscription?: {
        __typename?: 'Subscription';
        componentPlanInstallMethod?: InstallMethod | null;
      } | null;
    }> | null;
  };
};

export type CreateComponentplanMutationVariables = Exact<{
  namespace: Scalars['String']['input'];
  componentplan: CreateComponentplanInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type CreateComponentplanMutation = { __typename?: 'Mutation'; componentplanCreate: boolean };

export type UpdateComponentplanMutationVariables = Exact<{
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  componentplan: UpdateComponentplanInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateComponentplanMutation = { __typename?: 'Mutation'; componentplanUpdate: boolean };

export type DeleteComponentplanMutationVariables = Exact<{
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type DeleteComponentplanMutation = { __typename?: 'Mutation'; componentplanRemove: boolean };

export type RollbackComponentplanMutationVariables = Exact<{
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type RollbackComponentplanMutation = {
  __typename?: 'Mutation';
  componentplanRollback: boolean;
};

export type GetComponentsQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  chartName?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  isNewer?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GetComponentsQuery = {
  __typename?: 'Query';
  components: {
    __typename?: 'PaginatedComponent';
    totalCount: number;
    hasNextPage: boolean;
    nodes?: Array<{
      __typename?: 'Component';
      name: string;
      chartName: string;
      displayName?: string | null;
      description?: string | null;
      repository: string;
      creationTimestamp?: string | null;
      deprecated?: boolean | null;
      icon?: string | null;
      keywords?: Array<string> | null;
      sources?: Array<string> | null;
      home?: string | null;
      updatedAt?: string | null;
      status?: ComponentStatus | null;
      source?: ComponentSource | null;
      latestVersion?: string | null;
      isNewer?: boolean | null;
      versions?: Array<{
        __typename?: 'ComponentVersion';
        createdAt?: string | null;
        updatedAt?: string | null;
        appVersion?: string | null;
        version?: string | null;
      }> | null;
    }> | null;
  };
};

export type GetComponentsAllQueryVariables = Exact<{ [key: string]: never }>;

export type GetComponentsAllQuery = {
  __typename?: 'Query';
  componentsAll: Array<{
    __typename?: 'Component';
    name: string;
    chartName: string;
    displayName?: string | null;
    description?: string | null;
    repository: string;
    creationTimestamp?: string | null;
    deprecated?: boolean | null;
    icon?: string | null;
    keywords?: Array<string> | null;
    sources?: Array<string> | null;
    home?: string | null;
    updatedAt?: string | null;
    status?: ComponentStatus | null;
    source?: ComponentSource | null;
    latestVersion?: string | null;
    versions?: Array<{
      __typename?: 'ComponentVersion';
      createdAt?: string | null;
      updatedAt?: string | null;
      appVersion?: string | null;
      version?: string | null;
    }> | null;
  }>;
};

export type GetComponentQueryVariables = Exact<{
  name: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetComponentQuery = {
  __typename?: 'Query';
  component: {
    __typename?: 'Component';
    name: string;
    chartName: string;
    displayName?: string | null;
    description?: string | null;
    repository: string;
    creationTimestamp?: string | null;
    deprecated?: boolean | null;
    icon?: string | null;
    keywords?: Array<string> | null;
    sources?: Array<string> | null;
    home?: string | null;
    updatedAt?: string | null;
    status?: ComponentStatus | null;
    source?: ComponentSource | null;
    versions?: Array<{
      __typename?: 'ComponentVersion';
      createdAt?: string | null;
      updatedAt?: string | null;
      appVersion?: string | null;
      version?: string | null;
      deprecated?: boolean | null;
      digest?: string | null;
      urls?: Array<string> | null;
    }> | null;
    maintainers?: Array<{
      __typename?: 'ComponentMaintainer';
      email?: string | null;
      name?: string | null;
      url?: string | null;
    }> | null;
    repositoryCR?: {
      __typename?: 'Repository';
      imageOverride?: Array<{
        __typename?: 'RepositoryImageOverride';
        registry?: string | null;
        newRegistry?: string | null;
        path?: string | null;
        newPath?: string | null;
      }> | null;
    } | null;
  };
};

export type UploadComponentMutationVariables = Exact<{
  repository: Scalars['String']['input'];
  file: Scalars['Upload']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type UploadComponentMutation = { __typename?: 'Mutation'; componentUpload: boolean };

export type DeleteComponentMutationVariables = Exact<{
  chart: DeleteComponentInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type DeleteComponentMutation = { __typename?: 'Mutation'; componentDelete: boolean };

export type DownloadComponentMutationVariables = Exact<{
  chart: DownloadComponentInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type DownloadComponentMutation = { __typename?: 'Mutation'; componentDownload: string };

export type GetComponentChartQueryVariables = Exact<{
  name: Scalars['String']['input'];
  version: Scalars['String']['input'];
}>;

export type GetComponentChartQuery = {
  __typename?: 'Query';
  component: {
    __typename?: 'Component';
    name: string;
    chart?: {
      __typename?: 'ComponentChart';
      images?: Array<string> | null;
      valuesYaml?: string | null;
    } | null;
  };
};

export type GetRepositoriesQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  repositoryTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  statuses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetRepositoriesQuery = {
  __typename?: 'Query';
  repositories: {
    __typename?: 'PaginatedRepository';
    totalCount: number;
    hasNextPage: boolean;
    nodes?: Array<{
      __typename?: 'Repository';
      name: string;
      repositoryType?: string | null;
      status: RepositoryStatus;
      reason?: string | null;
      url: string;
      creationTimestamp: string;
      lastSuccessfulTime?: string | null;
    }> | null;
  };
};

export type GetRepositoriesAllQueryVariables = Exact<{ [key: string]: never }>;

export type GetRepositoriesAllQuery = {
  __typename?: 'Query';
  repositoriesAll: Array<{
    __typename?: 'Repository';
    name: string;
    repositoryType?: string | null;
    status: RepositoryStatus;
    url: string;
    creationTimestamp: string;
    lastSuccessfulTime?: string | null;
  }>;
};

export type GetRepositoryQueryVariables = Exact<{
  name: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetRepositoryQuery = {
  __typename?: 'Query';
  repository: {
    __typename?: 'Repository';
    name: string;
    repositoryType?: string | null;
    status: RepositoryStatus;
    reason?: string | null;
    url: string;
    creationTimestamp: string;
    lastSuccessfulTime?: string | null;
    insecure?: boolean | null;
    password?: string | null;
    username?: string | null;
    pullStategy?: {
      __typename?: 'RepositoryPullStategy';
      intervalSeconds?: number | null;
      retry?: number | null;
      timeoutSeconds?: number | null;
    } | null;
    filter?: Array<{
      __typename?: 'RepositoryFilter';
      name?: string | null;
      operation?: RepositoryFilterOperation | null;
      keepDeprecated?: boolean | null;
      regexp?: string | null;
      versionConstraint?: string | null;
      versions?: Array<string> | null;
    }> | null;
    imageOverride?: Array<{
      __typename?: 'RepositoryImageOverride';
      newPath?: string | null;
      path?: string | null;
      registry?: string | null;
      newRegistry?: string | null;
    }> | null;
  };
};

export type CreateRepositoryMutationVariables = Exact<{
  repository: CreateRepositoryInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type CreateRepositoryMutation = {
  __typename?: 'Mutation';
  repositoryCreate: {
    __typename?: 'Repository';
    name: string;
    repositoryType?: string | null;
    status: RepositoryStatus;
    url: string;
    creationTimestamp: string;
    lastSuccessfulTime?: string | null;
    insecure?: boolean | null;
    password?: string | null;
    username?: string | null;
    pullStategy?: {
      __typename?: 'RepositoryPullStategy';
      intervalSeconds?: number | null;
      retry?: number | null;
      timeoutSeconds?: number | null;
    } | null;
    filter?: Array<{
      __typename?: 'RepositoryFilter';
      name?: string | null;
      operation?: RepositoryFilterOperation | null;
      keepDeprecated?: boolean | null;
      regexp?: string | null;
      versionConstraint?: string | null;
      versions?: Array<string> | null;
    }> | null;
    imageOverride?: Array<{
      __typename?: 'RepositoryImageOverride';
      newPath?: string | null;
      path?: string | null;
      registry?: string | null;
      newRegistry?: string | null;
    }> | null;
  };
};

export type UpdateRepositoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  repository: UpdateRepositoryInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type UpdateRepositoryMutation = {
  __typename?: 'Mutation';
  repositoryUpdate: {
    __typename?: 'Repository';
    name: string;
    repositoryType?: string | null;
    status: RepositoryStatus;
    url: string;
    creationTimestamp: string;
    lastSuccessfulTime?: string | null;
    insecure?: boolean | null;
    password?: string | null;
    username?: string | null;
    pullStategy?: {
      __typename?: 'RepositoryPullStategy';
      intervalSeconds?: number | null;
      retry?: number | null;
      timeoutSeconds?: number | null;
    } | null;
    filter?: Array<{
      __typename?: 'RepositoryFilter';
      name?: string | null;
      operation?: RepositoryFilterOperation | null;
      keepDeprecated?: boolean | null;
      regexp?: string | null;
      versionConstraint?: string | null;
      versions?: Array<string> | null;
    }> | null;
    imageOverride?: Array<{
      __typename?: 'RepositoryImageOverride';
      newPath?: string | null;
      path?: string | null;
      registry?: string | null;
      newRegistry?: string | null;
    }> | null;
  };
};

export type RemoveRepositoryMutationVariables = Exact<{
  name: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type RemoveRepositoryMutation = { __typename?: 'Mutation'; repositoryRemove: boolean };

export type GetSubscriptionsPagedQueryVariables = Exact<{
  namespace: Scalars['String']['input'];
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  chartName?: InputMaybe<Scalars['String']['input']>;
  repository?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
  isNewer?: InputMaybe<Scalars['Boolean']['input']>;
}>;

export type GetSubscriptionsPagedQuery = {
  __typename?: 'Query';
  subscriptionsPaged: {
    __typename?: 'PaginatedSubscription';
    hasNextPage: boolean;
    totalCount: number;
    nodes?: Array<{
      __typename?: 'Subscription';
      name: string;
      namespace: string;
      creationTimestamp: string;
      releaseName?: string | null;
      repository: string;
      component?: {
        __typename?: 'Component';
        name: string;
        chartName: string;
        latestVersion?: string | null;
        updatedAt?: string | null;
        repository: string;
        isNewer?: boolean | null;
      } | null;
    }> | null;
  };
};

export type GetSubscriptionsQueryVariables = Exact<{
  namespace: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetSubscriptionsQuery = {
  __typename?: 'Query';
  subscriptions: Array<{
    __typename?: 'Subscription';
    name: string;
    namespace: string;
    releaseName?: string | null;
    component?: { __typename?: 'Component'; name: string } | null;
  }>;
};

export type CreateSubscriptionMutationVariables = Exact<{
  subscription: CreateSubscriptionInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type CreateSubscriptionMutation = { __typename?: 'Mutation'; subscriptionCreate: boolean };

export type DeleteSubscriptionMutationVariables = Exact<{
  name: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type DeleteSubscriptionMutation = { __typename?: 'Mutation'; subscriptionDelete: boolean };

export type RemoveSubscriptionMutationVariables = Exact<{
  component: Scalars['String']['input'];
  namespace: Scalars['String']['input'];
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type RemoveSubscriptionMutation = { __typename?: 'Mutation'; subscriptionRemove: boolean };

export const GetComponentplansPagedDocument = gql`
  query getComponentplansPaged(
    $namespace: String!
    $page: Float = 1
    $pageSize: Float = 20
    $releaseName: String
    $sortDirection: SortDirection
    $sortField: String
    $cluster: String
    $chartName: String
    $repository: String
    $status: [String!]
    $isNewer: Boolean
  ) {
    componentplansPaged(
      namespace: $namespace
      page: $page
      pageSize: $pageSize
      releaseName: $releaseName
      sortDirection: $sortDirection
      sortField: $sortField
      cluster: $cluster
      chartName: $chartName
      repository: $repository
      status: $status
      isNewer: $isNewer
    ) {
      nodes {
        name
        releaseName
        creationTimestamp
        namespace
        version
        status
        component {
          name
          chartName
          latestVersion
          repository
          isNewer
        }
        subscription {
          componentPlanInstallMethod
        }
      }
      hasNextPage
      totalCount
    }
  }
`;
export const GetComponentplanDocument = gql`
  query getComponentplan($name: String!, $namespace: String!, $cluster: String) {
    componentplan(name: $name, namespace: $namespace, cluster: $cluster) {
      name
      releaseName
      creationTimestamp
      namespace
      version
      status
      images {
        name
        newName
        newTag
      }
      component {
        chartName
        latestVersion
        repository
        versions {
          version
          deprecated
        }
      }
      subscription {
        componentPlanInstallMethod
        schedule
      }
      repository {
        imageOverride {
          registry
          newRegistry
          path
          newPath
        }
      }
      valuesYaml
    }
  }
`;
export const GetComponentplanHistoryDocument = gql`
  query getComponentplanHistory($name: String!, $namespace: String!, $cluster: String) {
    componentplan(name: $name, namespace: $namespace, cluster: $cluster) {
      namespace
      status
      releaseName
      component {
        chartName
      }
      history {
        name
        creationTimestamp
        version
        subscription {
          componentPlanInstallMethod
        }
      }
    }
  }
`;
export const CreateComponentplanDocument = gql`
  mutation createComponentplan(
    $namespace: String!
    $componentplan: CreateComponentplanInput!
    $cluster: String
  ) {
    componentplanCreate(namespace: $namespace, componentplan: $componentplan, cluster: $cluster)
  }
`;
export const UpdateComponentplanDocument = gql`
  mutation updateComponentplan(
    $name: String!
    $namespace: String!
    $componentplan: UpdateComponentplanInput!
    $cluster: String
  ) {
    componentplanUpdate(
      name: $name
      namespace: $namespace
      componentplan: $componentplan
      cluster: $cluster
    )
  }
`;
export const DeleteComponentplanDocument = gql`
  mutation deleteComponentplan($name: String!, $namespace: String!, $cluster: String) {
    componentplanRemove(name: $name, namespace: $namespace, cluster: $cluster)
  }
`;
export const RollbackComponentplanDocument = gql`
  mutation rollbackComponentplan($name: String!, $namespace: String!, $cluster: String) {
    componentplanRollback(name: $name, namespace: $namespace, cluster: $cluster)
  }
`;
export const GetComponentsDocument = gql`
  query getComponents(
    $page: Float = 1
    $pageSize: Float = 20
    $name: String
    $chartName: String
    $keyword: String
    $sortDirection: SortDirection
    $sortField: String
    $cluster: String
    $source: String
    $isNewer: Boolean
  ) {
    components(
      page: $page
      pageSize: $pageSize
      name: $name
      chartName: $chartName
      keyword: $keyword
      sortDirection: $sortDirection
      sortField: $sortField
      cluster: $cluster
      source: $source
      isNewer: $isNewer
    ) {
      nodes {
        name
        chartName
        displayName
        description
        repository
        creationTimestamp
        deprecated
        icon
        keywords
        sources
        home
        updatedAt
        status
        source
        latestVersion
        isNewer
        versions {
          createdAt
          updatedAt
          appVersion
          version
        }
      }
      totalCount
      hasNextPage
    }
  }
`;
export const GetComponentsAllDocument = gql`
  query getComponentsAll {
    componentsAll {
      name
      chartName
      displayName
      description
      repository
      creationTimestamp
      deprecated
      icon
      keywords
      sources
      home
      updatedAt
      status
      source
      latestVersion
      versions {
        createdAt
        updatedAt
        appVersion
        version
      }
    }
  }
`;
export const GetComponentDocument = gql`
  query getComponent($name: String!, $cluster: String) {
    component(name: $name, cluster: $cluster) {
      name
      chartName
      displayName
      description
      repository
      creationTimestamp
      deprecated
      icon
      keywords
      sources
      home
      updatedAt
      status
      source
      versions {
        createdAt
        updatedAt
        appVersion
        version
        deprecated
        digest
        urls
      }
      maintainers {
        email
        name
        url
      }
      repositoryCR {
        imageOverride {
          registry
          newRegistry
          path
          newPath
        }
      }
    }
  }
`;
export const UploadComponentDocument = gql`
  mutation uploadComponent($repository: String!, $file: Upload!, $cluster: String) {
    componentUpload(chart: { repository: $repository, file: $file }, cluster: $cluster)
  }
`;
export const DeleteComponentDocument = gql`
  mutation deleteComponent($chart: DeleteComponentInput!, $cluster: String) {
    componentDelete(chart: $chart, cluster: $cluster)
  }
`;
export const DownloadComponentDocument = gql`
  mutation downloadComponent($chart: DownloadComponentInput!, $cluster: String) {
    componentDownload(chart: $chart, cluster: $cluster)
  }
`;
export const GetComponentChartDocument = gql`
  query getComponentChart($name: String!, $version: String!) {
    component(name: $name) {
      name
      chart(version: $version) {
        images
        valuesYaml
      }
    }
  }
`;
export const GetRepositoriesDocument = gql`
  query getRepositories(
    $page: Float = 1
    $pageSize: Float = 20
    $name: String
    $repositoryTypes: [String!]
    $statuses: [String!]
    $sortDirection: SortDirection
    $sortField: String
    $cluster: String
  ) {
    repositories(
      page: $page
      pageSize: $pageSize
      name: $name
      repositoryTypes: $repositoryTypes
      statuses: $statuses
      sortDirection: $sortDirection
      sortField: $sortField
      cluster: $cluster
    ) {
      nodes {
        name
        repositoryType
        status
        reason
        url
        creationTimestamp
        lastSuccessfulTime
      }
      totalCount
      hasNextPage
    }
  }
`;
export const GetRepositoriesAllDocument = gql`
  query getRepositoriesAll {
    repositoriesAll {
      name
      repositoryType
      status
      url
      creationTimestamp
      lastSuccessfulTime
    }
  }
`;
export const GetRepositoryDocument = gql`
  query getRepository($name: String!, $cluster: String) {
    repository(name: $name, cluster: $cluster) {
      name
      repositoryType
      status
      reason
      url
      creationTimestamp
      lastSuccessfulTime
      insecure
      password
      username
      pullStategy {
        intervalSeconds
        retry
        timeoutSeconds
      }
      filter {
        name
        operation
        keepDeprecated
        regexp
        versionConstraint
        versions
      }
      imageOverride {
        newPath
        path
        registry
        newRegistry
      }
    }
  }
`;
export const CreateRepositoryDocument = gql`
  mutation createRepository($repository: CreateRepositoryInput!, $cluster: String) {
    repositoryCreate(repository: $repository, cluster: $cluster) {
      name
      repositoryType
      status
      url
      creationTimestamp
      lastSuccessfulTime
      insecure
      password
      username
      pullStategy {
        intervalSeconds
        retry
        timeoutSeconds
      }
      filter {
        name
        operation
        keepDeprecated
        regexp
        versionConstraint
        versions
      }
      imageOverride {
        newPath
        path
        registry
        newRegistry
      }
    }
  }
`;
export const UpdateRepositoryDocument = gql`
  mutation updateRepository($name: String!, $repository: UpdateRepositoryInput!, $cluster: String) {
    repositoryUpdate(name: $name, repository: $repository, cluster: $cluster) {
      name
      repositoryType
      status
      url
      creationTimestamp
      lastSuccessfulTime
      insecure
      password
      username
      pullStategy {
        intervalSeconds
        retry
        timeoutSeconds
      }
      filter {
        name
        operation
        keepDeprecated
        regexp
        versionConstraint
        versions
      }
      imageOverride {
        newPath
        path
        registry
        newRegistry
      }
    }
  }
`;
export const RemoveRepositoryDocument = gql`
  mutation removeRepository($name: String!, $cluster: String) {
    repositoryRemove(name: $name, cluster: $cluster)
  }
`;
export const GetSubscriptionsPagedDocument = gql`
  query getSubscriptionsPaged(
    $namespace: String!
    $page: Float = 1
    $pageSize: Float = 20
    $chartName: String
    $repository: String
    $sortDirection: SortDirection
    $sortField: String
    $cluster: String
    $isNewer: Boolean
  ) {
    subscriptionsPaged(
      namespace: $namespace
      page: $page
      pageSize: $pageSize
      chartName: $chartName
      repository: $repository
      sortDirection: $sortDirection
      sortField: $sortField
      cluster: $cluster
      isNewer: $isNewer
    ) {
      nodes {
        name
        namespace
        creationTimestamp
        releaseName
        component {
          name
          chartName
          latestVersion
          updatedAt
          repository
          isNewer
        }
        repository
      }
      hasNextPage
      totalCount
    }
  }
`;
export const GetSubscriptionsDocument = gql`
  query getSubscriptions($namespace: String!, $cluster: String) {
    subscriptions(namespace: $namespace, cluster: $cluster) {
      name
      namespace
      releaseName
      component {
        name
      }
    }
  }
`;
export const CreateSubscriptionDocument = gql`
  mutation createSubscription($subscription: CreateSubscriptionInput!, $cluster: String) {
    subscriptionCreate(subscription: $subscription, cluster: $cluster)
  }
`;
export const DeleteSubscriptionDocument = gql`
  mutation deleteSubscription($name: String!, $namespace: String!, $cluster: String) {
    subscriptionDelete(name: $name, namespace: $namespace, cluster: $cluster)
  }
`;
export const RemoveSubscriptionDocument = gql`
  mutation removeSubscription($component: String!, $namespace: String!, $cluster: String) {
    subscriptionRemove(component: $component, namespace: $namespace, cluster: $cluster)
  }
`;

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getComponentplansPaged(
      variables: GetComponentplansPagedQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentplansPagedQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentplansPagedQuery>(GetComponentplansPagedDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponentplansPaged',
        'query'
      );
    },
    getComponentplan(
      variables: GetComponentplanQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentplanQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentplanQuery>(GetComponentplanDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponentplan',
        'query'
      );
    },
    getComponentplanHistory(
      variables: GetComponentplanHistoryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentplanHistoryQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentplanHistoryQuery>(GetComponentplanHistoryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponentplanHistory',
        'query'
      );
    },
    createComponentplan(
      variables: CreateComponentplanMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<CreateComponentplanMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CreateComponentplanMutation>(CreateComponentplanDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createComponentplan',
        'mutation'
      );
    },
    updateComponentplan(
      variables: UpdateComponentplanMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<UpdateComponentplanMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<UpdateComponentplanMutation>(UpdateComponentplanDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'updateComponentplan',
        'mutation'
      );
    },
    deleteComponentplan(
      variables: DeleteComponentplanMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<DeleteComponentplanMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<DeleteComponentplanMutation>(DeleteComponentplanDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'deleteComponentplan',
        'mutation'
      );
    },
    rollbackComponentplan(
      variables: RollbackComponentplanMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<RollbackComponentplanMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<RollbackComponentplanMutation>(RollbackComponentplanDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'rollbackComponentplan',
        'mutation'
      );
    },
    getComponents(
      variables?: GetComponentsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentsQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentsQuery>(GetComponentsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponents',
        'query'
      );
    },
    getComponentsAll(
      variables?: GetComponentsAllQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentsAllQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentsAllQuery>(GetComponentsAllDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponentsAll',
        'query'
      );
    },
    getComponent(
      variables: GetComponentQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentQuery>(GetComponentDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponent',
        'query'
      );
    },
    uploadComponent(
      variables: UploadComponentMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<UploadComponentMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<UploadComponentMutation>(UploadComponentDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'uploadComponent',
        'mutation'
      );
    },
    deleteComponent(
      variables: DeleteComponentMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<DeleteComponentMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<DeleteComponentMutation>(DeleteComponentDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'deleteComponent',
        'mutation'
      );
    },
    downloadComponent(
      variables: DownloadComponentMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<DownloadComponentMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<DownloadComponentMutation>(DownloadComponentDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'downloadComponent',
        'mutation'
      );
    },
    getComponentChart(
      variables: GetComponentChartQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentChartQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentChartQuery>(GetComponentChartDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponentChart',
        'query'
      );
    },
    getRepositories(
      variables?: GetRepositoriesQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetRepositoriesQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetRepositoriesQuery>(GetRepositoriesDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getRepositories',
        'query'
      );
    },
    getRepositoriesAll(
      variables?: GetRepositoriesAllQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetRepositoriesAllQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetRepositoriesAllQuery>(GetRepositoriesAllDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getRepositoriesAll',
        'query'
      );
    },
    getRepository(
      variables: GetRepositoryQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetRepositoryQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetRepositoryQuery>(GetRepositoryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getRepository',
        'query'
      );
    },
    createRepository(
      variables: CreateRepositoryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<CreateRepositoryMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CreateRepositoryMutation>(CreateRepositoryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createRepository',
        'mutation'
      );
    },
    updateRepository(
      variables: UpdateRepositoryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<UpdateRepositoryMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<UpdateRepositoryMutation>(UpdateRepositoryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'updateRepository',
        'mutation'
      );
    },
    removeRepository(
      variables: RemoveRepositoryMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<RemoveRepositoryMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<RemoveRepositoryMutation>(RemoveRepositoryDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'removeRepository',
        'mutation'
      );
    },
    getSubscriptionsPaged(
      variables: GetSubscriptionsPagedQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetSubscriptionsPagedQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetSubscriptionsPagedQuery>(GetSubscriptionsPagedDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getSubscriptionsPaged',
        'query'
      );
    },
    getSubscriptions(
      variables: GetSubscriptionsQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetSubscriptionsQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetSubscriptionsQuery>(GetSubscriptionsDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getSubscriptions',
        'query'
      );
    },
    createSubscription(
      variables: CreateSubscriptionMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<CreateSubscriptionMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<CreateSubscriptionMutation>(CreateSubscriptionDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'createSubscription',
        'mutation'
      );
    },
    deleteSubscription(
      variables: DeleteSubscriptionMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<DeleteSubscriptionMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<DeleteSubscriptionMutation>(DeleteSubscriptionDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'deleteSubscription',
        'mutation'
      );
    },
    removeSubscription(
      variables: RemoveSubscriptionMutationVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<RemoveSubscriptionMutation> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<RemoveSubscriptionMutation>(RemoveSubscriptionDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'removeSubscription',
        'mutation'
      );
    },
  };
}
export type Sdk = ReturnType<typeof getSdk>;
export type SWRInfiniteKeyLoader<Data = unknown, Variables = unknown> = (
  index: number,
  previousPageData: Data | null
) => [keyof Variables, Variables[keyof Variables] | null] | null;
export function getSdkWithHooks(
  client: GraphQLClient,
  withWrapper: SdkFunctionWrapper = defaultWrapper
) {
  const sdk = getSdk(client, withWrapper);
  const utilsForInfinite = {
    generateGetKey:
      <Data = unknown, Variables = unknown>(
        id: SWRKeyInterface,
        getKey: SWRInfiniteKeyLoader<Data, Variables>
      ) =>
      (pageIndex: number, previousData: Data | null) => {
        const key = getKey(pageIndex, previousData);
        return key ? [id, ...key] : null;
      },
    generateFetcher:
      <Query = unknown, Variables = unknown>(
        query: (variables: Variables) => Promise<Query>,
        variables?: Variables
      ) =>
      ([id, fieldName, fieldValue]: [
        SWRKeyInterface,
        keyof Variables,
        Variables[keyof Variables]
      ]) =>
        query({ ...variables, [fieldName]: fieldValue } as Variables),
  };
  const genKey = <V extends Record<string, unknown> = Record<string, unknown>>(
    name: string,
    object: V = {} as V
  ): SWRKeyInterface => [
    name,
    ...Object.keys(object)
      .sort()
      .map(key => object[key]),
  ];
  return {
    ...sdk,
    useGetComponentplansPaged(
      variables: GetComponentplansPagedQueryVariables,
      config?: SWRConfigInterface<GetComponentplansPagedQuery, ClientError>
    ) {
      return useSWR<GetComponentplansPagedQuery, ClientError>(
        genKey<GetComponentplansPagedQueryVariables>('GetComponentplansPaged', variables),
        () => sdk.getComponentplansPaged(variables),
        config
      );
    },
    useGetComponentplansPagedInfinite(
      getKey: SWRInfiniteKeyLoader<
        GetComponentplansPagedQuery,
        GetComponentplansPagedQueryVariables
      >,
      variables: GetComponentplansPagedQueryVariables,
      config?: SWRInfiniteConfiguration<GetComponentplansPagedQuery, ClientError>
    ) {
      return useSWRInfinite<GetComponentplansPagedQuery, ClientError>(
        utilsForInfinite.generateGetKey<
          GetComponentplansPagedQuery,
          GetComponentplansPagedQueryVariables
        >(
          genKey<GetComponentplansPagedQueryVariables>('GetComponentplansPaged', variables),
          getKey
        ),
        utilsForInfinite.generateFetcher<
          GetComponentplansPagedQuery,
          GetComponentplansPagedQueryVariables
        >(sdk.getComponentplansPaged, variables),
        config
      );
    },
    useGetComponentplan(
      variables: GetComponentplanQueryVariables,
      config?: SWRConfigInterface<GetComponentplanQuery, ClientError>
    ) {
      return useSWR<GetComponentplanQuery, ClientError>(
        genKey<GetComponentplanQueryVariables>('GetComponentplan', variables),
        () => sdk.getComponentplan(variables),
        config
      );
    },
    useGetComponentplanHistory(
      variables: GetComponentplanHistoryQueryVariables,
      config?: SWRConfigInterface<GetComponentplanHistoryQuery, ClientError>
    ) {
      return useSWR<GetComponentplanHistoryQuery, ClientError>(
        genKey<GetComponentplanHistoryQueryVariables>('GetComponentplanHistory', variables),
        () => sdk.getComponentplanHistory(variables),
        config
      );
    },
    useGetComponents(
      variables?: GetComponentsQueryVariables,
      config?: SWRConfigInterface<GetComponentsQuery, ClientError>
    ) {
      return useSWR<GetComponentsQuery, ClientError>(
        genKey<GetComponentsQueryVariables>('GetComponents', variables),
        () => sdk.getComponents(variables),
        config
      );
    },
    useGetComponentsInfinite(
      getKey: SWRInfiniteKeyLoader<GetComponentsQuery, GetComponentsQueryVariables>,
      variables?: GetComponentsQueryVariables,
      config?: SWRInfiniteConfiguration<GetComponentsQuery, ClientError>
    ) {
      return useSWRInfinite<GetComponentsQuery, ClientError>(
        utilsForInfinite.generateGetKey<GetComponentsQuery, GetComponentsQueryVariables>(
          genKey<GetComponentsQueryVariables>('GetComponents', variables),
          getKey
        ),
        utilsForInfinite.generateFetcher<GetComponentsQuery, GetComponentsQueryVariables>(
          sdk.getComponents,
          variables
        ),
        config
      );
    },
    useGetComponentsAll(
      variables?: GetComponentsAllQueryVariables,
      config?: SWRConfigInterface<GetComponentsAllQuery, ClientError>
    ) {
      return useSWR<GetComponentsAllQuery, ClientError>(
        genKey<GetComponentsAllQueryVariables>('GetComponentsAll', variables),
        () => sdk.getComponentsAll(variables),
        config
      );
    },
    useGetComponent(
      variables: GetComponentQueryVariables,
      config?: SWRConfigInterface<GetComponentQuery, ClientError>
    ) {
      return useSWR<GetComponentQuery, ClientError>(
        genKey<GetComponentQueryVariables>('GetComponent', variables),
        () => sdk.getComponent(variables),
        config
      );
    },
    useGetComponentChart(
      variables: GetComponentChartQueryVariables,
      config?: SWRConfigInterface<GetComponentChartQuery, ClientError>
    ) {
      return useSWR<GetComponentChartQuery, ClientError>(
        genKey<GetComponentChartQueryVariables>('GetComponentChart', variables),
        () => sdk.getComponentChart(variables),
        config
      );
    },
    useGetRepositories(
      variables?: GetRepositoriesQueryVariables,
      config?: SWRConfigInterface<GetRepositoriesQuery, ClientError>
    ) {
      return useSWR<GetRepositoriesQuery, ClientError>(
        genKey<GetRepositoriesQueryVariables>('GetRepositories', variables),
        () => sdk.getRepositories(variables),
        config
      );
    },
    useGetRepositoriesInfinite(
      getKey: SWRInfiniteKeyLoader<GetRepositoriesQuery, GetRepositoriesQueryVariables>,
      variables?: GetRepositoriesQueryVariables,
      config?: SWRInfiniteConfiguration<GetRepositoriesQuery, ClientError>
    ) {
      return useSWRInfinite<GetRepositoriesQuery, ClientError>(
        utilsForInfinite.generateGetKey<GetRepositoriesQuery, GetRepositoriesQueryVariables>(
          genKey<GetRepositoriesQueryVariables>('GetRepositories', variables),
          getKey
        ),
        utilsForInfinite.generateFetcher<GetRepositoriesQuery, GetRepositoriesQueryVariables>(
          sdk.getRepositories,
          variables
        ),
        config
      );
    },
    useGetRepositoriesAll(
      variables?: GetRepositoriesAllQueryVariables,
      config?: SWRConfigInterface<GetRepositoriesAllQuery, ClientError>
    ) {
      return useSWR<GetRepositoriesAllQuery, ClientError>(
        genKey<GetRepositoriesAllQueryVariables>('GetRepositoriesAll', variables),
        () => sdk.getRepositoriesAll(variables),
        config
      );
    },
    useGetRepository(
      variables: GetRepositoryQueryVariables,
      config?: SWRConfigInterface<GetRepositoryQuery, ClientError>
    ) {
      return useSWR<GetRepositoryQuery, ClientError>(
        genKey<GetRepositoryQueryVariables>('GetRepository', variables),
        () => sdk.getRepository(variables),
        config
      );
    },
    useGetSubscriptionsPaged(
      variables: GetSubscriptionsPagedQueryVariables,
      config?: SWRConfigInterface<GetSubscriptionsPagedQuery, ClientError>
    ) {
      return useSWR<GetSubscriptionsPagedQuery, ClientError>(
        genKey<GetSubscriptionsPagedQueryVariables>('GetSubscriptionsPaged', variables),
        () => sdk.getSubscriptionsPaged(variables),
        config
      );
    },
    useGetSubscriptionsPagedInfinite(
      getKey: SWRInfiniteKeyLoader<GetSubscriptionsPagedQuery, GetSubscriptionsPagedQueryVariables>,
      variables: GetSubscriptionsPagedQueryVariables,
      config?: SWRInfiniteConfiguration<GetSubscriptionsPagedQuery, ClientError>
    ) {
      return useSWRInfinite<GetSubscriptionsPagedQuery, ClientError>(
        utilsForInfinite.generateGetKey<
          GetSubscriptionsPagedQuery,
          GetSubscriptionsPagedQueryVariables
        >(genKey<GetSubscriptionsPagedQueryVariables>('GetSubscriptionsPaged', variables), getKey),
        utilsForInfinite.generateFetcher<
          GetSubscriptionsPagedQuery,
          GetSubscriptionsPagedQueryVariables
        >(sdk.getSubscriptionsPaged, variables),
        config
      );
    },
    useGetSubscriptions(
      variables: GetSubscriptionsQueryVariables,
      config?: SWRConfigInterface<GetSubscriptionsQuery, ClientError>
    ) {
      return useSWR<GetSubscriptionsQuery, ClientError>(
        genKey<GetSubscriptionsQueryVariables>('GetSubscriptions', variables),
        () => sdk.getSubscriptions(variables),
        config
      );
    },
  };
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>;
