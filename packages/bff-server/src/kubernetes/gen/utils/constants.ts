import { join } from 'path';

export const FILE_HEADER = `/**
  * 由 src/kubernetes/gen/index.ts 自动生成
 * !!! 请不要修改 !!!
 */
`;
export const ROOT_DIR = join(__dirname, '../../');
export const LIB_DIR = join(ROOT_DIR, 'lib');
export const LIB_CORE_DIR = join(LIB_DIR, 'core');
export const LIB_RBAC_DIR = join(LIB_DIR, 'rbac');
export const LIB_APPS_DIR = join(LIB_DIR, 'apps');
export const LIB_BATCH_DIR = join(LIB_DIR, 'batch');
export const LIB_CRD_DIR = join(LIB_DIR, 'crd');
export const INTERFACES_DIR = join(LIB_DIR, 'interfaces');
export const INTERFACES_CRD_DIR = join(INTERFACES_DIR, 'crd');
export const INTERFACES_TEMPLATES_DIR = join(__dirname, '../templates/interfaces');
