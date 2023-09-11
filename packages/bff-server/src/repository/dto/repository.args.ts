import { PaginationArgs } from '@/common/models/pagination.args';
import { ComponentSource } from '@/components/models/component-source.enum';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RepostoryArgs extends PaginationArgs {
  /** 组件仓库名称 */
  name?: string;

  /** 类型 */
  @Field(() => [String], { description: '类型', nullable: true })
  repositoryTypes?: string[];

  /** 来源（官方） */
  source?: ComponentSource;

  /** 状态 */
  @Field(() => [String], { description: '状态', nullable: true })
  statuses?: string[];

  /** 集群（不传则为默认集群） */
  cluster?: string;
}
