import { InputType } from '@nestjs/graphql';
import { AnyObj } from 'src/types';

@InputType()
export class NewSecretInput {
  /** name */
  name: string;

  /** namespace */
  namespace: string;

  /** data */
  data: AnyObj;
}
