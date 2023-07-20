import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import { join } from 'path';
import {
  LIB_CORE_DIR,
  LIB_RBAC_DIR,
  processContentAndWriteFile,
  RsImport,
  toKebabCase,
  writeRsImportsFile,
} from './utils';

const PodTemplate = fs.readFileSync(join(LIB_CORE_DIR, 'pod.ts')).toString();
const NodeTemplate = fs.readFileSync(join(LIB_CORE_DIR, 'node.ts')).toString();

const RBAC_V1_RS_LIST = [
  {
    name: 'roles',
  },
  {
    name: 'rolebindings',
  },
  {
    name: 'clusterroles',
  },
  {
    name: 'clusterrolebindings',
  },
];

const rsImports: RsImport[] = [];

export const genRbac = async (kubeConfig: k8s.KubeConfig) => {
  const rbacAuthorizationV1Api = kubeConfig.makeApiClient(k8s.RbacAuthorizationV1Api);
  const {
    body: { groupVersion, resources },
  } = await rbacAuthorizationV1Api.getAPIResources();
  const [group, version] = groupVersion.split('/');
  resources
    .filter(rs => RBAC_V1_RS_LIST.some(rv1rs => rv1rs.name === rs.name))
    .forEach(({ kind, name, namespaced }) => {
      console.log(`[rbac.authorization.k8s.io] Namespaced(${namespaced}) =>`, kind);
      const fileName = toKebabCase(kind);
      rsImports.push({ rs: kind, fileName });
      processContentAndWriteFile(
        kind,
        join(LIB_RBAC_DIR, fileName + '.ts'),
        (namespaced
          ? PodTemplate.replace(/Pod/g, kind).replace(/name = 'pods'/, `name = '${name}'`)
          : NodeTemplate.replace(/Node/g, kind).replace(/name = 'nodes'/, `name = '${name}'`)
        )
          .replace(/CoreV1Api/g, 'RbacAuthorizationV1Api')
          .replace(/namespaced = true/, `namespaced = ${namespaced}`)
          .replace(/version = 'v1';/, `group = '${group}'; version = '${version}';`)
          .replace('@category core', '@category rbac')
      );
    });
  writeRsImportsFile(join(LIB_RBAC_DIR, 'index.ts'), rsImports);
  return rsImports;
};
