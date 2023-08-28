import { Field, InputType } from '@nestjs/graphql';

@InputType({ description: '删除组件' })
export class DeleteComponentInput {
  /** 组件仓库 */
  repository: string;

  /** Chart名称 */
  chartName: string;

  /** Chart版本 */
  @Field(() => [String], { description: '删除的版本' })
  versions: string[];
}
