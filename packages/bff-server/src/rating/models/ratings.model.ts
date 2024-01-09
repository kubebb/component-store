import { Configmap } from '@/configmap/models/configmap.model';
import { conditionsField } from '@/prompt/models/prompt.model';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class objectValModelField {
  key?: string;
  [k: string]: string;
}
@ObjectType()
class valueModelField {
  arrayVal?: string[];
  objectVal?: objectValModelField;
  stringVal?: string;
  @Field(() => String)
  type: 'string' | 'object' | 'array';
}

@ObjectType()
class paramsModelField {
  name: string;
  value: valueModelField;
}
@ObjectType()
export class pipelineModelField {
  pipelineName: string;
  dimension: string;
  params?: paramsModelField[];
}

@ObjectType()
export class evaluationsReliabilityField {
  conditions?: conditionsField[];
  prompt?: string;
  data?: string;
  [k: string]: any;
}

@ObjectType()
export class evaluationsField {
  reliability?: evaluationsReliabilityField;
}

@ObjectType()
export class pipelineRunsReliabilityField {
  pipelineName: string;
  pipelinerunName: string;
  [k: string]: any;
}
@ObjectType()
export class pipelineRunsField {
  reliability?: pipelineRunsReliabilityField;
}

@ObjectType()
export class ratingModelPromptField {
  conditions?: conditionsField[];
  evaluations?: evaluationsField;
  pipelineRuns?: pipelineRunsField;
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
  @Field(() => ratingModelPromptField)
  prompt?: ratingModelPromptField;
  /** RBAC */
  rbac?: Configmap;
}
