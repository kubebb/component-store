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
  /** Chart 名称 */
  chartName: Scalars['String']['output'];
  /** 创建时间 */
  creationTimestamp?: Maybe<Scalars['String']['output']>;
  /** 已废弃 */
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  /** 描述 */
  description?: Maybe<Scalars['String']['output']>;
  /** 组件官网 */
  home?: Maybe<Scalars['String']['output']>;
  /** icon */
  icon?: Maybe<Scalars['String']['output']>;
  /** 关键词 */
  keywords?: Maybe<Array<Scalars['String']['output']>>;
  /** 维护者 */
  maintainers?: Maybe<Array<ComponentMaintainer>>;
  /** 组件名称 */
  name: Scalars['ID']['output'];
  /** 所属仓库 */
  repository: Scalars['String']['output'];
  /** 源代码 */
  sources?: Maybe<Array<Scalars['String']['output']>>;
  /** 最近更新时间 */
  updatedAt?: Maybe<Scalars['String']['output']>;
  /** 版本 */
  versions?: Maybe<Array<ComponentVersion>>;
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
  /** Chart版本 */
  version?: Maybe<Scalars['String']['output']>;
};

/** 上传组件 */
export type CreateComponentInput = {
  /** 组件helm包 */
  file: Scalars['Upload']['input'];
  /** 组件仓库 */
  repository: Scalars['String']['input'];
};

export type CreateRepositoryInput = {
  /** 证书内容(base64) */
  certData?: InputMaybe<Scalars['String']['input']>;
  /** 组件过滤 */
  filter?: InputMaybe<Array<RepositoryFilterInput>>;
  /** 镜像仓库替换 */
  imageOverride?: InputMaybe<Array<RepositoryImageOverrideInput>>;
  /** https验证 */
  insecure?: InputMaybe<Scalars['Boolean']['input']>;
  /** 名称，规则：小写字母、数字、“-”，开头和结尾只能是字母或数字`（[a-z0-9]([-a-z0-9]*[a-z0-9])?）` */
  name: Scalars['String']['input'];
  /** 密码(base64) */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 组件更新 */
  pullStategy?: InputMaybe<RepositoryPullStategyInput>;
  /** 类型 */
  repositoryType: Scalars['String']['input'];
  /** URL */
  url: Scalars['String']['input'];
  /** 用户名(base64) */
  username?: InputMaybe<Scalars['String']['input']>;
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

export type Mutation = {
  __typename?: 'Mutation';
  /** 删除组件 */
  componentDelete: Scalars['Boolean']['output'];
  /** 发布组件 */
  componentUpload: Scalars['Boolean']['output'];
  repositoryCreate: Repository;
  /** 删除组件仓库 */
  repositoryRemove: Scalars['Boolean']['output'];
  repositoryUpdate: Repository;
};

export type MutationComponentDeleteArgs = {
  chart: DeleteComponentInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
};

export type MutationComponentUploadArgs = {
  chart: CreateComponentInput;
  cluster?: InputMaybe<Scalars['String']['input']>;
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
export type PaginatedRepository = {
  __typename?: 'PaginatedRepository';
  edges?: Maybe<Array<RepositoryEdge>>;
  hasNextPage: Scalars['Boolean']['output'];
  nodes?: Maybe<Array<Repository>>;
  page: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  totalCount: Scalars['Int']['output'];
};

export type Query = {
  __typename?: 'Query';
  /** 组件详情 */
  component: Component;
  /** 组件列表 */
  components: Array<Component>;
  /** 组件列表（分页） */
  componentsPaged: PaginatedComponent;
  /** 组件仓库列表 */
  repositories: Array<Repository>;
  /** 组件仓库列表（分页） */
  repositoriesPaged: PaginatedRepository;
  /** 组件仓库详情 */
  repository: Repository;
};

export type QueryComponentArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
};

export type QueryComponentsPagedArgs = {
  chartName?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
};

export type QueryRepositoriesPagedArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  repositoryTypes?: InputMaybe<Array<Scalars['String']['input']>>;
  statuses?: InputMaybe<Array<Scalars['String']['input']>>;
};

export type QueryRepositoryArgs = {
  cluster?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
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
  /** 获取Chart包异常 */
  ReadyFalse = 'ready_false',
  /** 创建中 */
  ReadyTrue = 'ready_true',
  /** 同步失败 */
  SyncedFalse = 'synced_false',
  /** 同步成功 */
  SyncedTrue = 'synced_true',
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

export type UpdateRepositoryInput = {
  /** 证书内容(base64) */
  certData?: InputMaybe<Scalars['String']['input']>;
  /** 组件过滤 */
  filter?: InputMaybe<Array<RepositoryFilterInput>>;
  /** 镜像仓库替换 */
  imageOverride?: InputMaybe<Array<RepositoryImageOverrideInput>>;
  /** https验证 */
  insecure?: InputMaybe<Scalars['Boolean']['input']>;
  /** 密码(base64) */
  password?: InputMaybe<Scalars['String']['input']>;
  /** 组件更新 */
  pullStategy?: InputMaybe<RepositoryPullStategyInput>;
  /** 用户名(base64) */
  username?: InputMaybe<Scalars['String']['input']>;
};

export type GetComponentsPagedQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  chartName?: InputMaybe<Scalars['String']['input']>;
  keyword?: InputMaybe<Scalars['String']['input']>;
  sortDirection?: InputMaybe<SortDirection>;
  sortField?: InputMaybe<Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetComponentsPagedQuery = {
  __typename?: 'Query';
  componentsPaged: {
    __typename?: 'PaginatedComponent';
    totalCount: number;
    hasNextPage: boolean;
    nodes?: Array<{
      __typename?: 'Component';
      name: string;
      chartName: string;
      description?: string | null;
      repository: string;
      creationTimestamp?: string | null;
      deprecated?: boolean | null;
      icon?: string | null;
      keywords?: Array<string> | null;
      sources?: Array<string> | null;
      home?: string | null;
      updatedAt?: string | null;
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

export type GetComponentsQueryVariables = Exact<{ [key: string]: never }>;

export type GetComponentsQuery = {
  __typename?: 'Query';
  components: Array<{
    __typename?: 'Component';
    name: string;
    chartName: string;
    description?: string | null;
    repository: string;
    creationTimestamp?: string | null;
    deprecated?: boolean | null;
    icon?: string | null;
    keywords?: Array<string> | null;
    sources?: Array<string> | null;
    home?: string | null;
    updatedAt?: string | null;
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
    description?: string | null;
    repository: string;
    creationTimestamp?: string | null;
    deprecated?: boolean | null;
    icon?: string | null;
    keywords?: Array<string> | null;
    sources?: Array<string> | null;
    home?: string | null;
    updatedAt?: string | null;
    versions?: Array<{
      __typename?: 'ComponentVersion';
      createdAt?: string | null;
      updatedAt?: string | null;
      appVersion?: string | null;
      version?: string | null;
      deprecated?: boolean | null;
      digest?: string | null;
    }> | null;
    maintainers?: Array<{
      __typename?: 'ComponentMaintainer';
      email?: string | null;
      name?: string | null;
      url?: string | null;
    }> | null;
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

export type GetRepositoriesPagedQueryVariables = Exact<{
  page?: InputMaybe<Scalars['Float']['input']>;
  pageSize?: InputMaybe<Scalars['Float']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  repositoryTypes?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  statuses?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  cluster?: InputMaybe<Scalars['String']['input']>;
}>;

export type GetRepositoriesPagedQuery = {
  __typename?: 'Query';
  repositoriesPaged: {
    __typename?: 'PaginatedRepository';
    totalCount: number;
    hasNextPage: boolean;
    nodes?: Array<{
      __typename?: 'Repository';
      name: string;
      repositoryType?: string | null;
      status: RepositoryStatus;
      url: string;
      creationTimestamp: string;
      lastSuccessfulTime?: string | null;
    }> | null;
  };
};

export type GetRepositoriesQueryVariables = Exact<{ [key: string]: never }>;

export type GetRepositoriesQuery = {
  __typename?: 'Query';
  repositories: Array<{
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

export const GetComponentsPagedDocument = gql`
  query getComponentsPaged(
    $page: Float = 1
    $pageSize: Float = 20
    $name: String
    $chartName: String
    $keyword: String
    $sortDirection: SortDirection
    $sortField: String
    $cluster: String
  ) {
    componentsPaged(
      page: $page
      pageSize: $pageSize
      name: $name
      chartName: $chartName
      keyword: $keyword
      sortDirection: $sortDirection
      sortField: $sortField
      cluster: $cluster
    ) {
      nodes {
        name
        chartName
        description
        repository
        creationTimestamp
        deprecated
        icon
        keywords
        sources
        home
        updatedAt
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
export const GetComponentsDocument = gql`
  query getComponents {
    components {
      name
      chartName
      description
      repository
      creationTimestamp
      deprecated
      icon
      keywords
      sources
      home
      updatedAt
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
      description
      repository
      creationTimestamp
      deprecated
      icon
      keywords
      sources
      home
      updatedAt
      versions {
        createdAt
        updatedAt
        appVersion
        version
        deprecated
        digest
      }
      maintainers {
        email
        name
        url
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
export const GetRepositoriesPagedDocument = gql`
  query getRepositoriesPaged(
    $page: Float = 1
    $pageSize: Float = 20
    $name: String
    $repositoryTypes: [String!]
    $statuses: [String!]
    $cluster: String
  ) {
    repositoriesPaged(
      page: $page
      pageSize: $pageSize
      name: $name
      repositoryTypes: $repositoryTypes
      statuses: $statuses
      cluster: $cluster
    ) {
      nodes {
        name
        repositoryType
        status
        url
        creationTimestamp
        lastSuccessfulTime
      }
      totalCount
      hasNextPage
    }
  }
`;
export const GetRepositoriesDocument = gql`
  query getRepositories {
    repositories {
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

export type SdkFunctionWrapper = <T>(
  action: (requestHeaders?: Record<string, string>) => Promise<T>,
  operationName: string,
  operationType?: string
) => Promise<T>;

const defaultWrapper: SdkFunctionWrapper = (action, _operationName, _operationType) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    getComponentsPaged(
      variables?: GetComponentsPagedQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetComponentsPagedQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetComponentsPagedQuery>(GetComponentsPagedDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getComponentsPaged',
        'query'
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
    getRepositoriesPaged(
      variables?: GetRepositoriesPagedQueryVariables,
      requestHeaders?: GraphQLClientRequestHeaders
    ): Promise<GetRepositoriesPagedQuery> {
      return withWrapper(
        wrappedRequestHeaders =>
          client.request<GetRepositoriesPagedQuery>(GetRepositoriesPagedDocument, variables, {
            ...requestHeaders,
            ...wrappedRequestHeaders,
          }),
        'getRepositoriesPaged',
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
    useGetComponentsPaged(
      variables?: GetComponentsPagedQueryVariables,
      config?: SWRConfigInterface<GetComponentsPagedQuery, ClientError>
    ) {
      return useSWR<GetComponentsPagedQuery, ClientError>(
        genKey<GetComponentsPagedQueryVariables>('GetComponentsPaged', variables),
        () => sdk.getComponentsPaged(variables),
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
    useGetRepositoriesPaged(
      variables?: GetRepositoriesPagedQueryVariables,
      config?: SWRConfigInterface<GetRepositoriesPagedQuery, ClientError>
    ) {
      return useSWR<GetRepositoriesPagedQuery, ClientError>(
        genKey<GetRepositoriesPagedQueryVariables>('GetRepositoriesPaged', variables),
        () => sdk.getRepositoriesPaged(variables),
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
  };
}
export type SdkWithHooks = ReturnType<typeof getSdkWithHooks>;
