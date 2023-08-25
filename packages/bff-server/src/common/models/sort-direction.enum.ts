import { registerEnumType } from '@nestjs/graphql';

export enum SortDirection {
  ascend = 'ascend',
  descend = 'descend',
}

registerEnumType(SortDirection, {
  name: 'SortDirection',
  description: '排序方向',
  valuesMap: {
    ascend: {
      description: '生序',
    },
    descend: {
      description: '降序',
    },
  },
});
