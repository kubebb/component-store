import { Prompt } from '@/prompt/models/prompt.model';
import { RatingStatus } from '@/rating/models/rating.status.enum';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '组件评测' })
export class Rating {
  /** 名称 */
  @Field(() => ID, { description: '名称' })
  name?: string;
  /** 组件名称 */
  componentName: string;
  /** namespace */
  namespace: string;
  /** 版本 */
  version?: string;
  /** 仓库名称 */
  repository: string;
  /** 评测时间 */
  @Field(() => String, { description: '最近评测时间' })
  creationTimestamp: string;
  /** promptNames */
  @HideField()
  promptNames?: string[];
  /** 评测状态 */
  @Field(() => RatingStatus, { description: '评测状态' })
  status?: string;
  /** prompts */
  prompts?: Prompt[];
  /** RBAC */
  rbac?: string;
}
