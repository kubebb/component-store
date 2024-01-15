import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class RatingConditionsField {
  lastTransitionTime?: string;
  message?: string;
  reason: string;
  status: string;
  type: string;
}

@ObjectType()
class AIRatingResultField {
  score: number;
  suggestions: string[];
  problems: string[];
}

@ObjectType()
class AIRatingTypeField {
  chinese: AIRatingResultField;
  english: AIRatingResultField;
}

@ObjectType()
class RatingResultField {
  type: string;
  status?: RatingConditionsField;
  prompt?: string;
  data?: AIRatingTypeField;
  taskName: string;
  pipelineName: string;
}

@ObjectType()
class RatingModelPromptField {
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
  /** 仓库名称 */
  repository: string;
  /** 创建时间 */
  creationTimestamp: string;
  /** prompt */
  prompt?: RatingModelPromptField;
  /** RBAC */
  rbac?: RbacModelField;
}
