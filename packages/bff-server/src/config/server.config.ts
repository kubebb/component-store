import { getConfigByPath, SERVER_CONFIG_PATH, SERVER_DEFAULT_CONFIG_PATH } from '@/common/utils';
import { registerAs } from '@nestjs/config';
import { mergeWith } from 'lodash';

function mergeCustomizer(objValue: any, srcValue: any) {
  if (srcValue && (Array.isArray(objValue) || Array.isArray(srcValue))) {
    return srcValue;
  }
}

const serverDefaultConfig = getConfigByPath(SERVER_DEFAULT_CONFIG_PATH);
const serverRuntimeConfig = getConfigByPath(SERVER_CONFIG_PATH);

export const serverConfig = mergeWith(serverDefaultConfig, serverRuntimeConfig, mergeCustomizer);

export default registerAs('server', () => serverConfig);
