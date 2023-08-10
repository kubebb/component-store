import { Request as ExpressReq } from 'express';
import { UserRole } from './common/models/user-role.enum';

export * as K8s from '@kubernetes/client-node';
export { NextFunction, Response } from 'express';
export * from './kubernetes/lib/interfaces';
export interface JwtAuth {
  iss: string;
  sub: string;
  aud: string | string[];
  exp: number;
  lat: number;
  at_hash: string;
  c_hash: string;
  email: string;
  email_verified: boolean;
  name: string;
  __name: string;
  preferred_username: string;
  tokenType: string;
  token: string;
  role: UserRole;
  ip: string;
}
export interface Request extends ExpressReq {
  auth?: JwtAuth;
  __reqId?: string;
}

export interface Labels {
  [k: string]: string;
}

export interface AnyObj {
  [k: string]: any;
}

export type KeyArrayStringMap = {
  [key: string]: string[];
};

export type KeyArrayStringMapNested = {
  [key: string]: KeyArrayStringMap;
};

interface A {
  [key1: string]: string[];
}

export interface MyContext {
  req: Request;
  res: Response;
  _my_parameters?: {
    tenantProjectsMap?: KeyArrayStringMap;
    tenantClustersMap?: KeyArrayStringMap;
    projectClustersMap?: KeyArrayStringMap;
    clusterProjectsMap?: KeyArrayStringMap;
    tenantClustersProjectsMap?: KeyArrayStringMapNested;
    [paramKey: string]: KeyArrayStringMap | KeyArrayStringMapNested;
  };
}

export interface FileUpload {
  filename: string;
  mimetype: string;
  encoding: string;
  createReadStream: () => Readable;
}
