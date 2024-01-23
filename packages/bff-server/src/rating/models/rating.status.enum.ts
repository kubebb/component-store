import { registerEnumType } from '@nestjs/graphql';

export enum RatingStatus {
  Created = 'Created',
  PipelineRunning = 'PipelineRunning',
  EvaluationSucceeded = 'EvaluationSucceeded',
}

registerEnumType(RatingStatus, {
  name: 'RatingStatus',
  description: '评测状态',
  valuesMap: {
    Created: {
      description: '已创建',
    },
    PipelineRunning: {
      description: '执行中',
    },
    EvaluationSucceeded: {
      description: '完成',
    },
  },
});

export enum RatingTaskStatus {
  Running = 'Running',
  Succeeded = 'Succeeded',
}

registerEnumType(RatingTaskStatus, {
  name: 'RatingTaskStatus',
  description: '任务状态',
  valuesMap: {
    Running: {
      description: '执行中',
    },
    Succeeded: {
      description: '完成',
    },
  },
});
