import { AnyObj } from '@/types';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
class PipelineParamsModel {
  arrayVal?: string[];
  @Field(() => JSON)
  objectVal?: AnyObj;
  stringVal?: string;
  default?: string;
  description: string;
  name: string;
  @Field(() => String)
  type: 'string' | 'object' | 'array';
}

@ObjectType()
export class Pipeline {
  @Field(() => ID, { description: `pipeline名称` })
  name: string;
  /** 创建时间 */
  creationTimestamp: string;
  /** dimension */
  dimension: string;
  /** params **/
  params: PipelineParamsModel[];
}
