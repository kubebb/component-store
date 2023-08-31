# 组件市场 component-store

Component store to list, view and deploy various components.

---

## 开发构建

### 快速开始

克隆项目:

```bash
git clone git@github.com:kubebb/component-store.git --recurse-submodules
# 如果忘记加这个 flag，也可以在 clone 代码后再执行以下命令来获取 submodule 的内容：
git submodule update --init --recursive
```

环境要求：

- **Node.js v18.x**
- **pnpm v8.x**

进入目录安装依赖:

```bash
npm i pnpm @antfu/ni -g
ni
```

开发：

```bash
# 开发 portal
# 注意：portal 依赖了 bff-client，开发前需要构建下 bff-client
nr build:client
nr dev:portal

# 开发 server
nr dev:server
```

### 构建

#### 仅构建静态文件

```bash
nr build
```

#### 构建镜像

执行以下命令可在本地构建镜像：

```bash
chmod +x ./build.sh ./update_base_image.sh
./build.sh
```

运行镜像：

```bash
docker run -d -p 8066:8066 172.22.50.223/dev-branch/component-store:main
```

### 代码风格检查

初始化 git hooks 工具 husky：

```bash
npx husky add .husky/pre-commit 'npm run lint-staged'
npx husky add .husky/commit-msg 'npx --no -- commitlint --edit "$1"'
chmod +x .husky/pre-commit .husky/commit-msg
# 记得提交初始化好的 husky 脚本
git add .husky/
```

**注意：初始化项目后一定要再初始化下 git hooks 工具 husky，记得提交初始化好的 husky 脚本。**

执行 lint 检查：

```bash
nr lint
```

> 注意事项: lint 规则默认忽略了 js、jsx 及 index.css 文件，这些文件一般都是低代码平台自动生成的，如果要手动开发页面，请使用 ts、tsx 及 less。
