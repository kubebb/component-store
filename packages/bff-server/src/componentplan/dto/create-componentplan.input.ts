import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateComponentplanInput {
  /** name */
  name: string;

  /** 名称 */
  displayName?: string;
}
