import { registerEnumType } from '@nestjs/graphql';

export enum RoleVerb {
  /** 创建 */
  create = 'create',
  /** 删除 */
  delete = 'delete',
  /** 修改 */
  update = 'update',
  /** 创建 */
  patch = 'patch',
  /** 获取 */
  get = 'get',
  /** 列取 */
  list = 'list',
  /** 监听 */
  watch = 'watch',
}

registerEnumType(RoleVerb, {
  name: 'RoleVerb',
  description: '角色资源读写权限',
  valuesMap: {
    create: {
      description: '创建',
    },
    delete: {
      description: '删除',
    },
    update: {
      description: '修改',
    },
    patch: {
      description: '补丁更新',
    },
    get: {
      description: '获取',
    },
    list: {
      description: '列取',
    },
    watch: {
      description: '监听',
    },
  },
});
