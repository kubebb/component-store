import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubscriptionInput {
  /** 项目 */
  namespace: string;
}
