# 组件市场 component-store

Component store to list, view and deploy various components.

---

## 开发构建

### 快速开始

环境要求：

- **Node.js v18.x**
- **pnpm v8.x**

开发：

```bash
nr dev
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

**PS：推荐使用我们的[流水线](https://tce.dev.21vianet.com/devops/pipelines)进行镜像构建，支持 CI/CD 等功能，创建流水线时可参考 [流水线 umi-demo-portal](https://tce.dev.21vianet.com/devops/pipelines/PLID-HJca-j9F3/definition)。**

### 代码风格检查

执行 lint 检查：

```bash
nr lint
```

> 注意事项: lint 规则默认忽略了 js、jsx 及 index.css 文件，这些文件一般都是低代码平台自动生成的，如果要手动开发页面，请使用 ts、tsx 及 less。
