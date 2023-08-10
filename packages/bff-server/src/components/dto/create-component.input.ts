import { FileUpload } from '@/types';
import { Field, InputType } from '@nestjs/graphql';
import * as GraphQLUpload from 'graphql-upload/GraphQLUpload.js';

@InputType({ description: '上传组件' })
export class CreateComponentInput {
  /** 组件仓库 */
  repository: string;

  /** 组件helm包 */
  @Field(() => GraphQLUpload)
  file: FileUpload;
}
