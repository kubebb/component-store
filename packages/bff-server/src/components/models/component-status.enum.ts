import { registerEnumType } from '@nestjs/graphql';

export enum ComponentStatus {
  ready = 'ready',
  syncing = 'syncing',
  deprecated = 'deprecated',
}

registerEnumType(ComponentStatus, {
  name: 'ComponentStatus',
  description: '组件状态',
  valuesMap: {
    ready: {
      description: '正常',
    },
    syncing: {
      description: '同步中',
    },
    deprecated: {
      description: '废弃',
    },
  },
});
