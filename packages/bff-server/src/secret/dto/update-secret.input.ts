import { InputType } from '@nestjs/graphql';
import { AnyObj } from 'src/types';

@InputType()
export class UpdateSecretInput {
  /** data */
  data: AnyObj;
}
