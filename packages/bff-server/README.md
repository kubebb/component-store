<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```

## config

配置详见 [configs/config.default.yaml](configs/config.default.yaml)，下面对 config.default.yaml 和 config.yaml 进行简要说明：

- config.default.yaml 是默认配置
- config.yaml 是运行时配置，配置后配置项会覆盖默认配置 config.default.yaml

**注意：新增配置都应在 config.default.yaml 中进行，config.yaml 的主要用途是在实际运行时可以通过挂载 configMap 的方式来进行配置自定义。**

在实际运行环境中可以通过挂载 configMap 到 `config/configs.yaml` 的方式自定义配置：

- 存储配置的 configMap：

```yaml
apiVersion: v1
data:
  config.yaml: |
    web:
      port: 8066
    log:
      levels: log,error,warn,debug
kind: ConfigMap
metadata:
  name: component-store-bff-server-config
```

- 将存储配置的 configMap 挂载到 deployment 中：

```yaml
kind: Deployment
apiVersion: apps/v1
metadata:
  name: component-store-bff-server
spec:
  replicas: 1
  template:
    spec:
      volumes:
        - name: component-store-bff-server-config-volume
          configMap:
            name: component-store-bff-server-config
      containers:
        - name: component-store-bff-server
          image: component-store-bff-server:1.0
          volumeMounts:
            # 注意只挂载到 configs/config.yaml 上，不要把整个 configs 目录都挂载了
            - name: component-store-bff-server-config-volume
              mountPath: /usr/src/app/packages/bff-server/configs/config.yaml
              subPath: config.yaml
```

请注意，以上示例是一个简化的配置示例，你需要根据实际的 Deployment 配置进行调整和扩展。

## Support

Nest is an MIT-licensed open source project. It can grow thanks to the sponsors and support by the amazing backers. If you'd like to join them, please [read more here](https://docs.nestjs.com/support).

## Stay in touch

- Author - [Kamil Myśliwiec](https://kamilmysliwiec.com)
- Website - [https://nestjs.com](https://nestjs.com/)
- Twitter - [@nestframework](https://twitter.com/nestframework)

## License

Nest is [MIT licensed](LICENSE).
