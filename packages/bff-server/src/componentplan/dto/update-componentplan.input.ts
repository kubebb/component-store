import { InputType, OmitType } from '@nestjs/graphql';
import { CreateComponentplanInput } from './create-componentplan.input';

@InputType()
export class UpdateComponentplanInput extends OmitType(
  CreateComponentplanInput,
  ['releaseName', 'chartName', 'repository'],
  InputType
) {}
