import { ObjectType } from '@nestjs/graphql';

@ObjectType({ description: '操作状态详情' })
export class K8sV1StatusDetails {
  group?: string;
  kind?: string;
  name?: string;
  uid?: string;
}

@ObjectType({ description: '操作状态' })
export class K8sV1Status {
  apiVersion?: string;
  code?: number;
  kind?: string;
  message?: string;
  status?: string;
  reason?: string;
  details?: K8sV1StatusDetails;
}

@ObjectType({ description: '操作状态' })
export class ResStatus {
  /** 状态码 */
  code: number;

  /** 状态 */
  status?: string;

  /** 状态信息 */
  message?: string;

  /** 是否成功 */
  success?: boolean;
}
