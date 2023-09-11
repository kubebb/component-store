const routes = [
  {
    name: 'component-store',
    path: '/',
    component: '@/layouts',
    routes: [
      {
        name: '组件仓库管理',
        path: '/components/warehouse',
        component: '@/pages/ComponentsWarehouse',
      },
      {
        path: '/components/warehouse/:id',
        component: '@/pages/ComponentsWarehouseCreate',
      },
      {
        name: '组件市场',
        path: '/components/market',
        component: '@/pages/ComponentsMarket',
      },
      {
        path: '/components/:page/:subPage/management-detail/:action/:id',
        component: '@/pages/ComponentsDetail',
      },
      {
        name: '组件管理-我发布的',
        path: '/components/management/publish',
        component: '@/pages/ComponentsManagementPublish',
      },
      {
        name: '组件管理-我订阅的',
        path: '/components/management/subscription',
        component: '@/pages/ComponentsManagementSubscription',
      },
      {
        name: '组件管理-我安装的',
        path: '/components/management/install',
        component: '@/pages/ComponentsManagementInstall',
      },
      {
        // name: '组件管理-我安装的-创建更新',
        path: '/components/:page/:subPage/management-action/:action/:id',
        component: '@/pages/ComponentsActions',
      },
      {
        // name: '组件管理-我安装的-详情',
        path: '/components/management/install/detail/:id',
        component: '@/pages/ComponentsManagementInstallDetail',
      },
    ],
  },
];

export default routes;
