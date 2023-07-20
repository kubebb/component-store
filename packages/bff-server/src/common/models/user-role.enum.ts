import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  /** 系统管理员 */
  SystemAdmin = 'SystemAdmin',
  /** 平台管理员 */
  PlatformAdmin = 'PlatformAdmin',
  /** 租户管理员 */
  TenantAdmin = 'TenantAdmin',
  /** 普通用户 */
  User = 'User',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: '用户角色',
  valuesMap: {
    SystemAdmin: {
      description: '系统管理员',
    },
    PlatformAdmin: {
      description: '平台管理员',
    },
    TenantAdmin: {
      description: '租户管理员',
    },
    User: {
      description: '普通用户',
    },
  },
});
