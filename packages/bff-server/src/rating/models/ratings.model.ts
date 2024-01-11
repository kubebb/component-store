import { Configmap } from '@/configmap/models/configmap.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class EvaluationsReliabilityField {
  conditions?: RatingConditionsField[];
  prompt?: string;
  data?: string;
  [k: string]: any;
}

@ObjectType()
class EvaluationsField {
  reliability?: EvaluationsReliabilityField;
}

@ObjectType()
class PipelineRunsReliabilityField {
  pipelineName: string;
  pipelinerunName: string;
  [k: string]: any;
}
@ObjectType()
class PipelineRunsField {
  reliability?: PipelineRunsReliabilityField;
}

@ObjectType()
class RatingConditionsField {
  lastTransitionTime?: string;
  message?: string;
  reason: string;
  status: string;
  type: string;
}

@ObjectType()
class RatingModelPromptField {
  conditions?: RatingConditionsField[];
  evaluations?: EvaluationsField;
  pipelineRuns?: PipelineRunsField;
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
  @Field(() => RatingModelPromptField)
  prompt?: RatingModelPromptField;
  /** RBAC */
  rbac?: Configmap;
}
