import * as k8s from '@kubernetes/client-node';
import * as fs from 'fs';
import { find } from 'lodash';
import { join } from 'path';
import { LIB_CORE_DIR, processContentAndWriteFile, toKebabCase, writeRsImportsFile } from './utils';

const PodTemplate = fs.readFileSync(join(LIB_CORE_DIR, 'pod.ts')).toString();
const NodeTemplate = fs.readFileSync(join(LIB_CORE_DIR, 'node.ts')).toString();

const CORE_V1_RS_LIST = [
  // 'Binding',
  // 'Pod',
  // 'PodBinding',
  // 'PodEviction',
  // 'Node',
  {
    name: 'configmaps',
  },
  {
    name: 'endpoints',
  },
  {
    name: 'events',
    _replace: (content: string) => content.replace(/V1Event/g, 'CoreV1Event'),
  },
  {
    name: 'limitranges',
  },
  {
    name: 'persistentvolumeclaims',
  },
  {
    name: 'podtemplates',
  },
  {
    name: 'replicationcontrollers',
  },
  {
    name: 'resourcequotas',
  },
  {
    name: 'secrets',
  },
  {
    name: 'services',
  },
  {
    name: 'serviceaccounts',
  },
  {
    name: 'namespaces',
  },
  {
    name: 'persistentvolumes',
  },
];

const rsImports = [
  {
    rs: 'Pod',
    fileName: 'pod',
  },
  {
    rs: 'Node',
    fileName: 'node',
  },
];

export const genCore = async (kubeConfig: k8s.KubeConfig) => {
  const coreV1Api = kubeConfig.makeApiClient(k8s.CoreV1Api);
  const { body } = await coreV1Api.getAPIResources();
  body.resources
    .filter(rs => CORE_V1_RS_LIST.some(cv1rs => cv1rs.name === rs.name))
    .forEach(({ kind, name, namespaced }) => {
      const _replace = find(CORE_V1_RS_LIST, { name })?._replace || (str => str);
      console.log(`[v1 core] Namespaced(${namespaced}) =>`, kind);
      const fileName = toKebabCase(kind);
      rsImports.push({ rs: kind, fileName });
      processContentAndWriteFile(
        kind,
        join(LIB_CORE_DIR, fileName + '.ts'),
        namespaced
          ? _replace(
              PodTemplate.replace(/Pod/g, kind)
                .replace(/name = 'pods'/, `name = '${name}'`)
                .replace(/namespaced = true/, `namespaced = ${namespaced}`)
            )
          : _replace(
              NodeTemplate.replace(/Node/g, kind)
                .replace(/name = 'nodes'/, `name = '${name}'`)
                .replace(/namespaced = true/, `namespaced = ${namespaced}`)
            )
      );
    });
  writeRsImportsFile(join(LIB_CORE_DIR, 'index.ts'), rsImports);
  return rsImports;
};
