import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '组件' })
export class Component {
  @Field(() => ID, { description: '组件名称' })
  name: string;
}
