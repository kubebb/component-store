import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class ConditionsField {
  lastTransitionTime?: string;
  message?: string;
  reason: string;
  status: string;
  type: string;
}

@ObjectType()
class PromptModelField {
  conditions?: ConditionsField[];
  data: string;
  [k: string]: any;
}

@ObjectType()
export class Prompt {
  @Field(() => ID, { description: `组件名称` })
  name: string;
  /** 创建时间 */
  creationTimestamp: string;
  /** prompt报告 */
  prompt?: PromptModelField;
}
