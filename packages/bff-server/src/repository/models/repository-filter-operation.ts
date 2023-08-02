import { registerEnumType } from '@nestjs/graphql';

export enum RepositoryFilterOperation {
  ignore_all = 'ignore_all',
  ignore_exact = 'ignore_exact',
  keep_exact = 'keep_exact',
}

registerEnumType(RepositoryFilterOperation, {
  name: 'RepositoryFilterOperation',
  description: '组件仓库状态',
  valuesMap: {
    ignore_all: {
      description: '全部过滤',
    },
    ignore_exact: {
      description: '精确过滤',
    },
    keep_exact: {
      description: '精确保留',
    },
  },
});
