import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class conditionsField {
  lastTransitionTime?: string;
  message?: string;
  reason: string;
  status: string;
  type: string;
}

@ObjectType()
export class promptModelField {
  conditions?: conditionsField[];
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
  prompt?: promptModelField;
}
