import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '加密配置' })
export class Secret {
  @Field(() => ID, { description: 'name' })
  name: string;

  @Field(() => JSON)
  data: Data;
}

interface Data {
  [k: string]: string;
}
