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
    ],
  },
];

export default routes;
