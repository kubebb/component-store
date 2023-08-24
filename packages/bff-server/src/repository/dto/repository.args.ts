import { PaginationArgs } from '@/common/models/pagination.args';
import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class RepostoryArgs extends PaginationArgs {
  /** 组件仓库名称 */
  name?: string;

  /** 类型 */
  @Field(() => [String], { description: '类型', nullable: true })
  repositoryTypes?: string[];

  /** 状态 */
  @Field(() => [String], { description: '状态', nullable: true })
  statuses?: string[];
}
