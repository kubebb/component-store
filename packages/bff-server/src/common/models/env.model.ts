import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '环境变量' })
export class Env {
  /** 环境变量名 */
  name: string;

  /** 环境变量值 */
  value?: string;
}
