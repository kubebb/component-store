import { Field, InputType, Int, PartialType } from '@nestjs/graphql';
import { CreateSubscriptionInput } from './create-subscription.input';

@InputType()
export class UpdateSubscriptionInput extends PartialType(CreateSubscriptionInput) {
  @Field(() => Int)
  id: number;
}
