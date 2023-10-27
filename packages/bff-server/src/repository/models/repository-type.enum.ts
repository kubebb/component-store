import { registerEnumType } from '@nestjs/graphql';

export enum RepositoryType {
  oci = 'oci',
  chartmuseum = 'chartmuseum',
  unknown = 'unknown',
}

registerEnumType(RepositoryType, {
  name: 'RepositoryType',
  description: '组件仓库类型',
  valuesMap: {
    oci: {
      description: 'OCI',
    },
    chartmuseum: {
      description: 'chartmuseum',
    },
    unknown: {
      description: '未知',
    },
  },
});
