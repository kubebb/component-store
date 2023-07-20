import { join } from 'path';

const { env } = process;

/** 默认配置的路径 */
export const SERVER_DEFAULT_CONFIG_PATH = join(
  __dirname,
  '../../../',
  'configs/config.default.yaml'
);
/** 运行时配置的路径 */
export const SERVER_CONFIG_PATH = join(__dirname, '../../../', 'configs/config.yaml');

export const GRAPHQL_PATH = '/bff';

/** 是否为生产环境 */
export const IS_PROD = env.NODE_ENV === 'production';

/** k8s 注入到 pod 中的 service account token 路径 */
export const K8S_SA_TOKEN_PATH = '/var/run/secrets/kubernetes.io/serviceaccount/token';
