import { InputType } from '@nestjs/graphql';

@InputType()
export class CreateRatingsInput {
  /** 组件名称 */
  componentName: string;

  /** 版本 */
  version: string;

  /** URL */
  url: string;

  /** 项目 */
  namespace?: string;
}
