import { registerEnumType } from '@nestjs/graphql';

export enum ComponentSource {
  official = 'official',
}

registerEnumType(ComponentSource, {
  name: 'ComponentSource',
  description: '组件来源',
  valuesMap: {
    official: {
      description: '官方',
    },
  },
});
