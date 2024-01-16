import { registerEnumType } from '@nestjs/graphql';

export enum RatingStatus {
  PipelineRunning = 'PipelineRunning',
  EvaluationSucceeded = 'EvaluationSucceeded',
}

registerEnumType(RatingStatus, {
  name: 'RatingStatus',
  description: '评测状态',
  valuesMap: {
    PipelineRunning: {
      description: '执行中',
    },
    EvaluationSucceeded: {
      description: '完成',
    },
  },
});
