import { RatingTaskField } from '@/rating/models/ratings.model';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

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
  /** taskList */
  taskList?: RatingTaskField[];
}
