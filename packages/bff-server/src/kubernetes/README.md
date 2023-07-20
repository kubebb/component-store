# kubernetes 模块

该模块是对 [@kubernetes/client-node](https://github.com/kubernetes-client/javascript) 的二次封装，从资源的维度重新组织了 api。

## 缘起

`@kubernetes/client-node` 是官方 k8s api 的 Node.js sdk，跟[官方文档](https://kubernetes.io/docs/reference/generated/kubernetes-api/v1.24/#-strong-api-groups-strong-)一样是以 api group 的方式组织的 api，对于不熟悉 k8s 的同学，这样的组织方式是不太友好的，增加了理解难度。其实我们大多数时候并不需要关心一个 k8s 资源的 api 分组是什么，我们只是想对 k8s 资源进行增删改查等基本操作，所以我从资源的角度重新对 k8s api 进行了封装。

## 初探

我们对比下 kubernetes 模块和 `@kubernetes/client-node` 对资源进行增删改查的区别：

1. 使用 kubernetes 模块对 User 这个 crd 资源进行增删改查：

```ts
const k8s = await this.k8sService.getClient(auth);
// 创建 user
k8s.user.create({
  metadata: {
    name: 'user1',
  },
  spec: { ... },
});
// 修改用户
k8s.user.patchMerge('user1', {
  spec: { ... },
});
// 列取用户
k8s.user.list();
// 根据名称获取用户
k8s.user.read('user1');
// 删除用户
k8s.user.delete('user1');
```

2. 使用 `@kubernetes/client-node` 对 User 这个资源进行增删改查：

```ts
// 创建 user
k8sApi.createClusterCustomObject(
  'iam.tenxcloud.com',
  'v1alpha1',
  'users',
  {
    kind: 'User',
    apiVersion: 'iam.tenxcloud.com/v1alpha1',
    metadata: {
      name: 'user1',
    },
    spec: { ... },
  },
)
// 修改用户
k8sApi.patchClusterCustomObject(
  'iam.tenxcloud.com',
  'v1alpha1',
  'users',
  'user1',
  {
    spec: { ... },
  },
  undefined,
  undefined,
  undefined,
  {
    headers: {
      'Content-Type': 'application/merge-patch+json',
    },
  },
);
// 列取用户
k8sApi.listClusterCustomObject(
  'iam.tenxcloud.com',
  'v1alpha1',
  'users',
);
// 根据名称获取用户
k8sApi.read(
  'iam.tenxcloud.com',
  'v1alpha1',
  'users',
  'user1',
);
// 删除用户
k8sApi.deleteClusterCustomObject(
  'iam.tenxcloud.com',
  'v1alpha1',
  'users',
  'user1',
);
```

从上面的对比很容易能看出来 kubernetes 模块使用起来比 `@kubernetes/client-node` 方便太多了，如果要操作其他资源直接在 `k8s` 实例中选择其他资源即可: `k8s.pod.list('default')`。

## 由来

kubernetes 模块大部分代码都是自动生成的，生成代码的逻辑在 `kubernetes/gen` 中，生成代码的逻辑比较简单，只是对模板文件的简单替换。以下为模板文件：

- `core/pod.ts`
- `core/node.ts`
- `crd/application.ts`
- `crd/user.ts`

模板文件又可以按照 scope 分成两大类，其中 pod 和 application 是命名空间(Namespaced) 维度的，node 和 user 是集群(Cluster) 维度的，类方法上会有一些细微差别，其他各种资源都是根据这 4 个模板生成来的。

执行下面的命令就可以生成或更新 kubernetes 模块：

```sh
nr gen:k8s
```

这个命令实际执行的是 `npm run gen:k8s-code && npm run gen:k8s-doc` 2 个命令，其中 `npm run gen:k8s-code` 是用来生成代码的，`npm run gen:k8s-doc` 是用来生成文档的，如果只是想生成文档，执行 `nr gen:k8s-doc` 即可，打开 `src/kubernetes/docs/index.html` 即可访问 kubernetes 模块的文档，具体资源的操作方法可以通过文档查看。

注意：crd 资源比较特殊，是通过 k8s api 获取到所有 crd 定义后，生成对应的 interface 和 class。为了能获取到 crd，执行生成命令前需要先在 `kubernetes/gen/crd.ts` 中配置下集群和用户认证信息：

```ts
const cluster = {
  name: 'kube-oidc-proxy',
  server: 'https://192.168.1.19:30208', // k8s 集群 api 地址
  skipTLSVerify: true,
};
const user = {
  name: 'admin', // 用户名
  token: 'eyJh.xxx', // 对应 token
};
```

## Todo

- [ ] 兼容 k8s 多版本
- [ ] 将 core 等资源也改为像 crd 一样通过 k8s api 获取
