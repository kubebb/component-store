import * as React from 'react'
// ⚠️ import 时候需要指定扩展名，即加上 .js
import BaasMain from "@tenx-ui/icon/lib/BaasMain.js";
import BaasOrganization from "@tenx-ui/icon/lib/BaasOrganization.js";

export const User = 'User'
export const TENANT_ADMIN = 'TenantAdmin'
export const PlatformAdmin = 'PlatformAdmin' // 3
export const SystemAdmin = 'SystemAdmin' // 2

const data = [
  {
    id: 'component-store',
    type: 'all-product',
    text: '<产品名称>',
    textEn: '<product name>',
    icon: BaasMain,
    column: 1,
    children: [
      {
        id: 'component-store-index',
        text: '<子产品名称>',
        textEn: '<sub product name>',
        children: [
          {
            id: 'component-store-index-1',
            text: '<子菜单名称>',
            textEn: '<sub menu name>',
            icon: BaasOrganization,
            pathname: '/test',
            tenant: false,
          },
        ]
      }
    ]
  },
]

export default data;
