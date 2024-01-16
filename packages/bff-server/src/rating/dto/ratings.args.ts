import { ArgsType, registerEnumType } from '@nestjs/graphql';

export enum RatingStatus {
  Running = 'Running',
  EvaluationSucceeded = 'EvaluationSucceeded',
}

registerEnumType(RatingStatus, {
  name: 'RatingStatus',
  description: '评测状态',
  valuesMap: {
    Running: {
      description: '执行中',
    },
    EvaluationSucceeded: {
      description: '完成',
    },
  },
});

@ArgsType()
export class RatingsArgs {
  /** rating名称 */
  name?: string;

  /** 组件名称 */
  componentName?: string;

  /** 项目 */
  namespace?: string;

  /** 版本 */
  version: string;

  /** 集群 */
  cluster?: string;
}
