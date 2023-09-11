import { UpdateComponentplanInput } from '@/componentplan/dto/update-componentplan.input';
import { InputType, PartialType } from '@nestjs/graphql';

@InputType()
export class UpdateSubscriptionInput extends PartialType(UpdateComponentplanInput) {}
