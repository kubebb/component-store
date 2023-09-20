import { dumpYaml, loadYaml } from '@kubernetes/client-node';
import * as crypto from 'crypto';
import { readFileSync } from 'fs';
import * as jwt from 'jsonwebtoken';
import { Jwt } from 'jsonwebtoken';
import { customAlphabet } from 'nanoid';
import { lowercase, numbers } from 'nanoid-dictionary';
import { BinaryLike, createHash } from 'node:crypto';
import { Readable } from 'node:stream';
import type { FileUpload, JwtAuth, K8s, Request } from '../../types';
import { TokenException } from './errors';

export const getConfigByPath = (configPath: string) => {
  const fileContent = readFileSync(configPath);
  return loadYaml<Record<string, any>>(fileContent.toString());
};

/**
 * 从 token 中解析用户认证信息
 */
export const getAuthFromToken = (token: string): JwtAuth => {
  let decodedToken: Jwt;
  try {
    decodedToken = jwt.decode(token, { complete: true });
  } catch (error) {
    throw new TokenException('invalid token', error);
  }
  if (!decodedToken?.payload || typeof decodedToken.payload === 'string') {
    throw new TokenException('invalid token', decodedToken);
  }
  const auth = {
    ...(decodedToken.payload as any),
    token,
  };
  // 以 preferred_username 为准
  auth.__name = auth.name;
  auth.name = auth.preferred_username;
  return auth;
};

/**
 * 睡眠暂停函数
 * @param seconds 秒
 */
export const sleep = (seconds: number) =>
  new Promise(resolve => setTimeout(resolve, seconds * 1000));

/**
 * 获取随机字符串
 */
export const randomUUID = () => crypto.randomUUID();

/**
 * 判断是否都为 true
 * @param booleanList 布尔类型数组
 */
export const isAllTrue = (booleanList: boolean[]) => !booleanList.includes(false);

/**
 * 生成当前用户的日志字符串
 * @param req request 对象
 */
export const genUserLogString = (req: Request) => {
  const { auth, ip = '-', __reqId, method, url, baseUrl, body } = req;
  const operationName = body?.operationName || '-';
  let userRoleIp = '';
  if (!auth) {
    userRoleIp = `N/A@${ip}`;
  } else {
    const { name, role } = auth;
    userRoleIp = `${name}${role ? `(${role})` : ''}@${ip}`;
  }
  return `${userRoleIp} [${__reqId}] ${method} ${baseUrl || url} ${operationName}`;
};

export const nanoid = customAlphabet(numbers + lowercase, 5);

/**
 * 生成带前缀的短 id
 * @param {string} prefix 前缀
 * @returns
 */
export const genNanoid = (prefix: string) => `${prefix}-${nanoid()}`;

/**
 * Base64 转码 encode
 */
export const encodeBase64 = (value: string) => Buffer.from(value || '').toString('base64');

/**
 * Base64 转码 decode
 */
export const decodeBase64 = (value: string) => Buffer.from(value || '', 'base64').toString('utf-8');

/**
 * 首字母大写
 */
export const initialToUpperCase = (value: string) =>
  (value || '').replace(/^(\w)/, (_, $0) => $0.toUpperCase());

/**
 * 生成 es 配置的 key
 * @param clusterName 集群 name
 * @returns
 */
export const genClusterConfigsEsKey = (clusterName: string) => `es-${clusterName}`;

/**
 * 将k8s资源对象转为页面显示的Yaml
 * @param spec k8s资源对象
 */
export const processedYaml = (spec: K8s.KubernetesObject) => {
  if (spec?.metadata?.uid) {
    delete spec?.metadata?.uid;
  }
  return dumpYaml(spec);
};

/**
 * 读取 readableStream 内容
 * @param file FileUpload
 */
export const convertFileToText = async (file: FileUpload): Promise<string> => {
  if (!file) return null;
  const { createReadStream } = await file;
  const readStream = createReadStream();
  const chunks = [];
  let size = 0;
  return new Promise(resolve => {
    readStream.on('data', chunk => {
      chunks.push(chunk);
      size += chunk.length;
    });
    readStream.on('end', () => {
      const bufs = Buffer.concat(chunks, size);
      resolve(bufs.toString());
    });
    readStream.on('error', () => {
      console.error('Error: utils.convertFileToText');
      resolve(null);
    });
  });
};

/**
 * 根据内容生成hash
 * @param {BinaryLike} data
 * @returns
 */
export const genContentHash = (data: BinaryLike) => {
  const hash = createHash('sha256');
  hash.update(data);
  return hash.digest('hex');
};

/**
 * 根据内容生成hash
 * @param {Readable} readable
 * @returns
 */
export const genContentHashByReadable = (readable: Readable): Promise<string> => {
  const hash = createHash('sha256');
  return new Promise((resolve, reject) => {
    const stream = readable.pipe(hash).setEncoding('hex');
    let data = '';
    stream.on('data', (d: string) => {
      data += d;
    });
    stream.on('end', () => {
      resolve(data);
    });
    stream.on('error', (e: any) => {
      reject(e);
    });
  });
};
