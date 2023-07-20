# @tenx-ui/component-store-bff-client

component-store-bff-server api 的 clent sdk，前端可使用这个 sdk 对 component-store-bff-server 的 api 发起调用

## 使用

安装：

```bash
ni swr @tenx-ui/component-store-bff-client
```

使用：

> @Todo: 待修改

```tsx
import { sdk, useSWR } from '@tenx-ui/component-store-bff-client';
import { Button, Table } from 'antd';

const Page = () => {
  const { data, loading, mute } = sdk.useGetApps();

  return (
    <div>
      <div>
        <Button type="primary" onClick={mute}>
          刷新
        </Button>
      </div>
      <Table
        columns={[
          {
            dataIndex: 'id',
            sorter: true,
            title: 'ID',
          },
          {
            dataIndex: 'name',
            sorter: true,
            title: '名称',
          },
          {
            dataIndex: 'description',
            sorter: true,
            title: '描述',
          },
        ]}
        dataSource={data?.apps || []}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};
export default Page;
```

## 扩展

当 sdk 内置的方法不能满足需求时，我们可以直接使用 client 来做自定义使用。

例如我们获取应用列表时只想获取应用的 ID 和名称，就可以这么写：

> @Todo: 待修改

```tsx
import { client, genKey } from '@tenx-ui/component-store-bff-client';
import gql from 'graphql-tag';

const GetAppsCustomDocument = gql`
  query getAppsIdName {
    apps {
      id
      name
    }
  }
`;
const getAppsCustom = () => client.request(GetAppsCustomDocument);
const useGetAppsCustom = (variables, config) =>
  useSWR(genKey('GetAppsCustom', variables), () => getAppsCustom(variables), config);
```

## 开发

环境要求：

- **Node.js v18.x**
- **pnpm v8.x**

安装依赖：

```bash
$ npm i pnpm @antfu/ni -g
$ ni
```

运行项目：

```bash
$ nr dev
```

构建项目：

```bash
$ nr build
```

发布版本：

```bash
$ nr pub
```
