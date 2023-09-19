import { registerEnumType } from '@nestjs/graphql';

export enum ExportComponentplanStatus {
  Installing = 'Installing',
  Uninstalling = 'Uninstalling',
  InstallSuccess = 'InstallSuccess',
  InstallFailed = 'InstallFailed',
  UninstallFailed = 'UninstallFailed',
  Unknown = 'Unknown',
}

registerEnumType(ExportComponentplanStatus, {
  name: 'ExportComponentplanStatus',
  description: '组件状态',
  valuesMap: {
    Installing: {
      description: '安装中',
    },
    Uninstalling: {
      description: '卸载中',
    },
    InstallSuccess: {
      description: '安装成功',
    },
    InstallFailed: {
      description: '安装失败',
    },
    UninstallFailed: {
      description: '卸载失败',
    },
    Unknown: {
      description: '未知',
    },
  },
});
