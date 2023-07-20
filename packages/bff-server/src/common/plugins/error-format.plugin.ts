import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { Logger } from '@nestjs/common';
import { MyContext } from '../../types';
import { genUserLogString } from '../utils';
import { ErrorExtensions } from '../utils/errors';

@Plugin()
export class ErrorFormatPlugin implements ApolloServerPlugin {
  logger = new Logger('GraphQL Error');

  async requestDidStart(): Promise<GraphQLRequestListener<MyContext>> {
    return {
      async didEncounterErrors(context) {
        // console.log('context', context)
        const req = context.contextValue.req;
        Logger.error(context.errors, req && genUserLogString(req), context.source);
        context.errors.forEach((e: any) => {
          // console.log('e.keys', Object.getOwnPropertyNames((e)))
          const { body, statusCode, response } = e.originalError || {};
          const responseMsg = `${response?.request?.method || '-'} ${
            response?.request?.href || '-'
          } [${statusCode}] ${typeof body === 'object' ? JSON.stringify(body) : body} => `;
          Logger.error(responseMsg + e.originalError?.stack || e.stack);
          if (body?.kind === 'Status') {
            // @Todo 需要通过其他方式格式化错误，extensions 这些字段是只读的
            e.extensions = new ErrorExtensions(statusCode, body.message, body.details);
            e.message = body.message;
            delete e.originalError;
            delete e.extensions.exception.message;
          }
          // @Todo: 其他错误也需要处理
        });
      },
    };
  }
}
