import { registerEnumType } from '@nestjs/graphql';

export enum InstallMethod {
  manual = 'manual',
  auto = 'auto',
}

registerEnumType(InstallMethod, {
  name: 'InstallMethod',
  description: '组件更新方式',
  valuesMap: {
    manual: {
      description: '手动',
    },
    auto: {
      description: '自动',
    },
  },
});
