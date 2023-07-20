import { RoleVerb } from '../models/role-verb.enum';

const getErrorCodeByStatusCode = (statusCode: number) => {
  switch (statusCode) {
    case 400:
      return 'BadRequest';
    case 401:
      return 'Unauthorized';
    case 402:
      return 'PaymentRequired';
    case 403:
      return 'Forbidden';
    case 404:
      return 'NotFound';
    case 409:
      return 'Conflict';
    case 429:
      return 'TooManyRequests';
    case 500:
      return 'InternalServerError';
    case 502:
      return 'BadGateway';
    case 503:
      return 'ServiceUnavailable';
    case 504:
      return 'GatewayTimeout';
    default:
      return `${statusCode} Error`;
  }
};

export interface ErrorStatusDetails {
  /** 资源名称 */
  name?: string;

  /** 资源类型 */
  kind?: string;

  /** 操作 */
  verb?: RoleVerb;

  [key: string]: any;
}

export class ErrorException {
  code: number;
  message: string;
  details: ErrorStatusDetails;

  constructor(code: number, message: string, details: ErrorStatusDetails = {}) {
    this.code = code;
    this.message = message;
    const verb = message.replace(/^.* cannot ([a-z]+) resource .*$/, '$1');
    const { name, kind, ...resDetails } = details;
    this.details = {
      name,
      kind,
      verb: RoleVerb[verb],
      res: resDetails,
    };
  }
}

export class ErrorExtensions {
  code: string;
  statusCode: number;
  exception: ErrorException;
  constructor(statusCode: number, message: string, details?: ErrorStatusDetails) {
    this.code = getErrorCodeByStatusCode(statusCode);
    this.statusCode = statusCode;
    this.exception = new ErrorException(statusCode, message, details);
  }
}

/**
 * bff 标准错误
 *
 * sdk 中会统一处理这种标准的错误，做对应提示
 *
 * 使用举例：
 * ```js
 * new BFFError('roles role-rv1of not found', 404, {
 *   name: 'role-rv1of',
 *   kind: 'roles',
 *   verb: RoleVerb.get,
 * });
 * ```
 * 前端收到的返回如下：
 * ```json
 * {
 *   "errors": [
 *     {
 *       "message": "roles \"role-rv1of\" not found",
 *       "locations": [],
 *       "path": [],
 *       "extensions": {
 *       "code": "NotFound",
 *       "statusCode": 404,
 *         "exception": {
 *           "code": 404,
 *           "details": {
 *             "name": "role-rv1of",
 *             "kind": "roles",
 *             "verb": "get"
 *           },
 *         }
 *       }
 *     }
 *   ]
 * }
 * ```
 * @export
 * @class BFFError
 * @extends {Error}
 */
export class GraphQLException extends Error {
  extensions: ErrorExtensions;

  constructor(message: string, statusCode: number, details: ErrorStatusDetails) {
    super(message);
    this.extensions = new ErrorExtensions(statusCode, message, details);
  }
}

/**
 * 仅用于 token 不可用的报错，前端收到这个报错后会提示用户重新登录
 *
 * @export
 * @class TokenException
 * @extends {Error}
 */
export class TokenException extends Error {
  extensions: ErrorExtensions;

  constructor(message: string, rawArgs: any = {}) {
    super(message);

    this.extensions = new ErrorExtensions(401, message, {
      kind: 'token',
      ...rawArgs,
    });

    this.extensions.code = 'InvalidToken';
  }
}

/**
 * 自定义错误
 *
 * 可以自定义错误的 code，前端可根据特定的 code 做对应提示
 *
 * @export
 * @class CustomException
 * @extends {Error}
 */
export class CustomException extends Error {
  extensions: ErrorExtensions;

  constructor(code: string, message: string, statusCode: number, details?: ErrorStatusDetails) {
    super(message);
    this.extensions = new ErrorExtensions(statusCode, message, details);

    this.extensions.code = code;
  }
}
