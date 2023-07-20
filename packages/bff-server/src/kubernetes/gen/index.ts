import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import { join } from 'path';
import { genApps } from './apps';
import { genBatch } from './batch';
import { genCore } from './core';
import { genCrd } from './crd';
import { genRbac } from './rbac';
import { firstLetterToLowercase, getRegExp, ROOT_DIR, RsImport } from './utils';

const cluster = {
  name: 'kube-oidc-proxy',
  server: 'https://k8s.172.22.96.209.nip.io',
  skipTLSVerify: true,
};
const user = {
  name: 'admin',
  token:
    'eyJhbGciOiJSUzI1NiIsImtpZCI6ImI3MTVlYjZiZTE1MDhlNTQ4MjNmMWYyNjNjMzZhYTdhMmE4ODgyMWUifQ.eyJpc3MiOiJodHRwczovL3BvcnRhbC4xNzIuMjIuOTYuMjA5Lm5pcC5pby9vaWRjIiwic3ViIjoiQ2dWaFpHMXBiaElHYXpoelkzSmsiLCJhdWQiOiJiZmYtY2xpZW50IiwiZXhwIjoxNjg5OTA1Mjc0LCJpYXQiOjE2ODk4MTg4NzQsImF0X2hhc2giOiJBcHg4WlVLT3UzZzBtR1lTbExHTWpRIiwiY19oYXNoIjoiSTJYS3hSMGZvQjlXaERjSDRwWnpiZyIsImVtYWlsIjoiYWRtaW5AdGVueGNsb3VkLmNvbSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJncm91cHMiOlsic3lzdGVtOm1hc3RlcnMiLCJpYW0udGVueGNsb3VkLmNvbSIsIm9ic2VydmFiaWxpdHkiLCJyZXNvdXJjZS1yZWFkZXIiXSwibmFtZSI6ImFkbWluIiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW4iLCJwaG9uZSI6IiIsInVzZXJpZCI6ImFkbWluIn0.CMz19C6n69Ee9btm-smqzQsfYNhMyofOePayvZ8OA3bx5VrfV06r1xrvaPs7wUQyDsQWEaw8H2qjBjxZGS_-u9WhY7I-FVWj8wchGSjUKja1OdItHUntYf8e4txutqsrB15UFsmJVxb3DLt3YRPLG2PFholo24POrWMAI0wrDGYIjjCE32dJ9wNnB2uXBFbjHZQP6mTTVoyd3ZpHeJ93OdkntnW8ZaeEJeapSTSCkugvURvqNg5kwLfBzXXI23oNqUb8Btsk28MJXiGw_kPeDeNLG-iSMDkPhQvoahWvJQaAr3MqZho3bZZpb9ry0cKj8XUP3z5av4C9Y2Kj-DDxZw',
};
const createKubeConfig = (cluster: k8s.Cluster, user: k8s.User) => {
  const kubeConfig = new k8s.KubeConfig();
  kubeConfig.loadFromClusterAndUser(cluster, user);
  return kubeConfig;
};
const kubeConfig = createKubeConfig(cluster, user);

const K8S_SERVICE_PATH = join(ROOT_DIR, 'kubernetes.service.ts');
let K8sServiceContent = fs.readFileSync(K8S_SERVICE_PATH).toString();
const replaceK8sServiceContent = (
  rsImports: RsImport[],
  group = 'core',
  apiClientType = 'coreV1Api'
) => {
  K8sServiceContent = K8sServiceContent.replace(
    getRegExp(`<replace type="${group}">`, `</replace type="${group}">`),
    `// <replace type="${group}">\n${rsImports
      .map(({ rs }) => `${firstLetterToLowercase(rs)}: new lib.${rs}(${apiClientType})`)
      .join(',\n')},\n// </replace type="${group}">`
  );
  fs.writeFileSync(K8S_SERVICE_PATH, K8sServiceContent);
};

async function gen() {
  // gen core v1 rs
  const coreRsImports = await genCore(kubeConfig);
  replaceK8sServiceContent(coreRsImports, 'core', 'coreV1Api');

  // gen crd
  const crdRsImports = await genCrd(kubeConfig);
  replaceK8sServiceContent(crdRsImports, 'crd', 'customObjectsApi');

  // gen rbac v1 rs
  const rbacRsImports = await genRbac(kubeConfig);
  replaceK8sServiceContent(rbacRsImports, 'rbac', 'rbacAuthorizationV1Api');

  // gen apps v1 rs
  const appsRsImports = await genApps(kubeConfig);
  replaceK8sServiceContent(appsRsImports, 'apps', 'appsV1Api');

  // gen apps v1 rs
  const batchRsImports = await genBatch(kubeConfig);
  replaceK8sServiceContent(batchRsImports, 'batch', 'batchV1Api');
}

gen();
