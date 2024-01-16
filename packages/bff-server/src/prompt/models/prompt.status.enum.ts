import { registerEnumType } from '@nestjs/graphql';

export enum PromptStatus {
  ReconcileRunning = 'ReconcileRunning',
  ReconcileSuccess = 'ReconcileSuccess',
}

registerEnumType(PromptStatus, {
  name: 'PromptStatus',
  description: 'Prompt状态',
  valuesMap: {
    ReconcileRunning: {
      description: '执行中',
    },
    ReconcileSuccess: {
      description: '完成',
    },
  },
});
