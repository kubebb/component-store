import { registerEnumType } from '@nestjs/graphql';

export enum ComponentplanStatus {
  WaitDo = 'WaitDo',
  Installing = 'Installing',
  Upgrading = 'Upgrading',
  Uninstalling = 'Uninstalling',
  RollingBack = 'RollingBack',
  InstallSuccess = 'InstallSuccess',
  InstallFailed = 'InstallFailed',
  UninstallSuccess = 'UninstallSuccess',
  UninstallFailed = 'UninstallFailed',
  UpgradeSuccess = 'UpgradeSuccess',
  UpgradeFailed = 'UpgradeFailed',
  RollBackSuccess = 'RollBackSuccess',
  RollBackFailed = 'RollBackFailed',
}

registerEnumType(ComponentplanStatus, {
  name: 'ComponentplanStatus',
  description: '组件状态',
  valuesMap: {
    WaitDo: {
      description: '前置步骤失败',
    },
    Installing: {
      description: '安装中',
    },
    Upgrading: {
      description: '升级中',
    },
    Uninstalling: {
      description: '卸载中',
    },
    RollingBack: {
      description: '回滚中',
    },
    InstallSuccess: {
      description: '安装成功',
    },
    InstallFailed: {
      description: '安装失败',
    },
    UninstallSuccess: {
      description: '卸载成功',
    },
    UninstallFailed: {
      description: '卸载失败',
    },
    UpgradeSuccess: {
      description: '升级成功',
    },
    UpgradeFailed: {
      description: '升级失败',
    },
    RollBackSuccess: {
      description: '回滚成功',
    },
    RollBackFailed: {
      description: '回滚失败',
    },
  },
});
