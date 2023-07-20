import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import { join } from 'path';
import {
  LIB_BATCH_DIR,
  LIB_CORE_DIR,
  processContentAndWriteFile,
  RsImport,
  toKebabCase,
  writeRsImportsFile,
} from './utils';

const PodTemplate = fs.readFileSync(join(LIB_CORE_DIR, 'pod.ts')).toString();

const RbacV1ApiRs = [
  {
    name: 'CronJob',
    scope: 'Namespaced',
  },
  {
    name: 'Job',
    scope: 'Namespaced',
  },
];

const rsImports: RsImport[] = [];

export const genBatch = async (kubeConfig: k8s.KubeConfig) => {
  const batchV1Api = kubeConfig.makeApiClient(k8s.BatchV1Api);
  const { body } = await batchV1Api.getAPIResources();
  console.log(JSON.stringify(body));
  // @Todo: k8s 1.20 中 CronJob 的版本是 v1beta1，与 1.24 不同，暂时不考虑跨版本的兼容性
  RbacV1ApiRs.forEach(({ name }) => {
    console.log('[v1 batch] Namespaced(true) =>', name);
    const fileName = toKebabCase(name);
    rsImports.push({ rs: name, fileName });
    processContentAndWriteFile(
      name,
      join(LIB_BATCH_DIR, fileName + '.ts'),
      PodTemplate.replace(/Pod/g, name)
        .replace(/CoreV1Api/g, 'BatchV1Api')
        .replace(/version = 'v1';/, `group = 'batch'; version = 'v1';`)
        .replace('@category core', '@category batch')
    );
  });
  writeRsImportsFile(join(LIB_BATCH_DIR, 'index.ts'), rsImports);
  return rsImports;
};
