import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class llmConditionsField {
  lastSuccessfulTime?: string;
  lastTransitionTime: string;
  message?: string;
  reason: string;
  status: string;
  type: string;
}

@ObjectType()
class llmStatusModelField {
  conditions?: llmConditionsField[];
  [k: string]: any;
}

@ObjectType()
export class Llm {
  @Field(() => ID)
  name: string;
  /** 创建时间 */
  creationTimestamp: string;
  /** status */
  status?: llmStatusModelField;
}
