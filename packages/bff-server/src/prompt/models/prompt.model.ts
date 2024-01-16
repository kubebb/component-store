import { PromptStatus } from '@/prompt/models/prompt.status.enum';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class PromptConditionsField {
  @Field(() => String, { description: '结束时间' })
  lastTransitionTime?: string;
  message?: string;
  reason?: string;
  @Field(() => PromptStatus, { description: '状态' })
  status?: string;
  type?: string;
}

@ObjectType()
export class Prompt {
  @Field(() => ID, { description: `prompt名称` })
  name: string;
  /** rating名称 */
  @Field(() => String, { description: `rating名称` })
  ratingName: string;
  /** 类型名称 */
  @Field(() => String, { description: `类型名称` })
  dimension: string;
  /** 任务名称 */
  @Field(() => String, { description: `任务名称` })
  pipelinerun: string;
  /** 评分 */
  @Field(() => Number, { description: '评分' })
  score: number;
  @HideField()
  namespacedName: string;
  /** 创建时间 */
  creationTimestamp: string;
  /** 建议 */
  @Field(() => String, { description: '建议' })
  suggestions: string;
  /** 问题 */
  @Field(() => String, { description: '问题' })
  problems: string;
  /** status */
  status?: PromptConditionsField;
}
