import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateSubscriptionInput {
  /** 项目 */
  namespace: string;

  /** 组件name（如 kubebb.minio） */
  name: string;
}
