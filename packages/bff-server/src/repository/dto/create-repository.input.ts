import { FileUpload } from '@/types';
import { Field, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';
import { RepositoryFilterOperation } from '../models/repository-filter-operation';

@InputType({ description: '组件更新' })
class RepositoryPullStategyInput {
  /** 间隔时间 */
  intervalSeconds?: number;

  /** 重试次数 */
  retry?: number;

  /** 超时时间 */
  timeoutSeconds?: number;
}

@InputType({ description: '组件过滤' })
class RepositoryFilterInput {
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

@InputType({ description: '镜像仓库替换' })
class RepositoryImageOverrideInput {
  /** 新域名 */
  newRegistry?: string;

  /** 原域名 */
  registry?: string;

  /** 原仓库组 */
  path?: string;

  /** 新仓库组 */
  newPath?: string;
}

@InputType()
export class CreateRepositoryInput {
  /** metadata.name */
  @Field(() => String, {
    description:
      '名称，规则：小写字母、数字、“-”，开头和结尾只能是字母或数字`（[a-z0-9]([-a-z0-9]*[a-z0-9])?）`',
  })
  name: string;

  /** 类型 */
  repositoryType: string;

  /** URL */
  url: string;

  /** https验证 */
  insecure?: boolean;

  /** ca.pem（根证书） */
  @Field(() => GraphQLUpload)
  cadata?: FileUpload;

  /** client.pem（客户端证书） */
  @Field(() => GraphQLUpload)
  certdata?: FileUpload;

  /** client.key（客户端私钥） */
  @Field(() => GraphQLUpload)
  keydata?: FileUpload;

  /** 用户名(base64) */
  username?: string;

  /** 密码(base64) */
  password?: string;

  /** 组件更新 */
  @Field(() => RepositoryPullStategyInput)
  pullStategy?: RepositoryPullStategyInput;

  /** 组件过滤 */
  @Field(() => [RepositoryFilterInput])
  filter?: RepositoryFilterInput[];

  /** 镜像仓库替换 */
  @Field(() => [RepositoryImageOverrideInput])
  imageOverride?: RepositoryImageOverrideInput[];
}
