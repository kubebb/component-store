import { registerEnumType } from '@nestjs/graphql';

export enum RepositoryStatus {
  synced_true = 'synced_true',
  synced_false = 'synced_false',
  ready_true = 'ready_true',
  ready_false = 'ready_false',
  unknown = 'unknown',
  health = 'health',
  syncing = 'syncing',
  failed = 'failed',
}

registerEnumType(RepositoryStatus, {
  name: 'RepositoryStatus',
  description: '组件仓库状态',
  valuesMap: {
    synced_true: {
      description: '同步成功',
    },
    synced_false: {
      description: '同步失败',
    },
    ready_true: {
      description: '创建中',
    },
    ready_false: {
      description: '获取Chart包异常',
    },
    unknown: {
      description: '未知',
    },
    health: {
      description: '健康',
    },
    syncing: {
      description: '同步中',
    },
    failed: {
      description: '异常',
    },
  },
});
