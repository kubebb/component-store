import { AnyObj } from '@/types';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RatingConditionsField {
  @Field(() => String, { description: '结束时间' })
  lastTransitionTime?: string;
  message?: string;
  reason: string;
  status?: string;
  type?: string;
}

@ObjectType()
class RatingResultField {
  creationTimestamp: string;
  dimension: string;
  status?: RatingConditionsField;
  prompt?: string;
  score: number;
  suggestions: string;
  problems: string;
  pipelinerun: string;
}

@ObjectType()
class RatingModelPromptField {
  @HideField()
  evaluations?: AnyObj;
  score: number;
  status?: RatingConditionsField;
  ratingResult?: RatingResultField[];
}

@ObjectType()
class RbacModelField {
  name: string;
  digraph: string;
}

@ObjectType({ description: '组件评测' })
export class Rating {
  /** 名称 */
  @Field(() => ID, { description: '名称' })
  name?: string;
  /** 组件名称 */
  componentName: string;
  /** namespace */
  namespace: string;
  @HideField()
  namespacedName: string;
  /** 仓库名称 */
  repository: string;
  /** 评测时间 */
  @Field(() => String, { description: '最近评测时间' })
  creationTimestamp: string;
  /** promptNames */
  promptNames?: string[];
  /** prompt */
  prompt?: RatingModelPromptField;
  /** RBAC */
  rbac?: RbacModelField;
}
