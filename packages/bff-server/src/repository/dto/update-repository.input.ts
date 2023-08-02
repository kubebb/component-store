import { InputType, OmitType } from '@nestjs/graphql';
import { CreateRepositoryInput } from './create-repository.input';

@InputType()
export class UpdateRepositoryInput extends OmitType(CreateRepositoryInput, [
  'name',
  'url',
  'repositoryType',
]) {}
