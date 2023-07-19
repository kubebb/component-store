const routes = [
  {
    name: 'component-store',
    path: '/',
    component: '@/layouts',
    routes: [
      {
        name: 'test',
        path: '/test',
        component: '@/pages/Test',
      },
    ],
  },
];

export default routes;
