import { ArgsType } from '@nestjs/graphql';

@ArgsType()
export class RatingsArgs {
  /** rating名称 */
  name?: string;

  /** 仓库 */
  repository?: string;

  /** 组件名称 */
  componentName?: string;

  /** 项目 */
  namespace?: string;

  /** 版本 */
  version?: string;

  /** 集群 */
  cluster?: string;

  /** 最近一次评测 */
  isLatestSuccessed?: boolean;
}
