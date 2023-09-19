// ⚠️ import 时候需要指定扩展名，即加上 .js
import KubebbComponents from "@tenx-ui/icon/lib/KubebbComponents.js";
import KubebbMarket from "@tenx-ui/icon/lib/KubebbMarket.js";
import KubebbWarehouse from "@tenx-ui/icon/lib/KubebbWarehouse.js";


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
    icon: KubebbMarket,
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
            icon: KubebbWarehouse,
            pathname: '/components/warehouse',
            tenant: false,
          },
          {
            id: 'component-store-market',
            text: '组件市场',
            textEn: 'Component Market',
            icon: KubebbMarket,
            pathname: '/components/market',
            tenant: false,
          },
          {
            id: 'component-store-management',
            text: '组件管理',
            textEn: 'Component Management',
            icon: KubebbComponents,
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
                tenant: true,
                project: true,
                cluster: true,
              },
              {
                id: 'component-store-management-subscribed',
                text: '我订阅的',
                textEn: 'I Subscribed',
                pathname: '/components/management/subscription',
                tenant: true,
                project: true,
                cluster: true,
              },
            ]
          }
        ]
      }
    ]
  },
]

export default data;
