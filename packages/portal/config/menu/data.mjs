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
    text: '组件市场',
    textEn: 'Component Market',
    icon: BaasMain,
    column: 1,
    children: [
      {
        id: 'component-store-index',
        text: '组件市场',
        textEn: 'Component Market',
        children: [
          {
            id: 'component-store-repository',
            text: '组件仓库管理',
            textEn: 'Component Repository',
            icon: BaasOrganization,
            pathname: '/components/warehouse',
            tenant: false,
          },
          {
            id: 'component-store-market',
            text: '组件市场',
            textEn: 'Component Market',
            icon: BaasOrganization,
            pathname: '/components/market',
            tenant: false,
          },
          {
            id: 'component-store-management',
            text: '组件管理',
            textEn: 'Component Management',
            children: [
              {
                id: 'component-store-management-publish',
                text: '我发布的',
                textEn: 'I Published',
                pathname: '/components/management/publish',
                tenant: false,
              },
              {
                id: 'component-store-management-installed',
                text: '我安装的',
                textEn: 'I Installed',
                pathname: '/components/management/install',
              },
              {
                id: 'component-store-management-subscribed',
                text: '我订阅的',
                textEn: 'I Subscribed',
                pathname: '/components/management/subscription',
              },
            ]
          }
        ]
      }
    ]
  },
]

export default data;
