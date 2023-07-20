import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import { join } from 'path';
import {
  LIB_APPS_DIR,
  LIB_CORE_DIR,
  processContentAndWriteFile,
  RsImport,
  toKebabCase,
  writeRsImportsFile,
} from './utils';

const PodTemplate = fs.readFileSync(join(LIB_CORE_DIR, 'pod.ts')).toString();

const APPS_V1_RS_LIST = [
  {
    name: 'controllerrevisions',
  },
  {
    name: 'daemonsets',
  },
  {
    name: 'deployments',
  },
  {
    name: 'replicasets',
  },
  {
    name: 'statefulsets',
  },
];

const rsImports: RsImport[] = [];

export const genApps = async (kubeConfig: k8s.KubeConfig) => {
  const appsV1Api = kubeConfig.makeApiClient(k8s.AppsV1Api);
  const {
    body: { groupVersion, resources },
  } = await appsV1Api.getAPIResources();
  const [group, version] = groupVersion.split('/');
  resources
    .filter(rs => APPS_V1_RS_LIST.some(av1rs => av1rs.name === rs.name))
    .forEach(({ kind, name, namespaced }) => {
      console.log(`[v1 apps] Namespaced(${namespaced}) =>`, kind);
      const fileName = toKebabCase(kind);
      rsImports.push({ rs: kind, fileName });
      processContentAndWriteFile(
        kind,
        join(LIB_APPS_DIR, fileName + '.ts'),
        PodTemplate.replace(/Pod/g, kind)
          .replace(/CoreV1Api/g, 'AppsV1Api')
          .replace(/name = 'pods'/, `name = '${name}'`)
          .replace(/namespaced = true/, `namespaced = ${namespaced}`)
          .replace(/version = 'v1';/, `group = '${group}'; version = '${version}';`)
          .replace('@category core', '@category apps')
      );
    });
  writeRsImportsFile(join(LIB_APPS_DIR, 'index.ts'), rsImports);
  return rsImports;
};
