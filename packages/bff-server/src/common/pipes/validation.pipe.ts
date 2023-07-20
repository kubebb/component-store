import { ApolloServerErrorCode } from '@apollo/server/errors';
import { ValidationPipe as ValidationPipeCommon, ValidationPipeOptions } from '@nestjs/common';
import { GraphQLError } from 'graphql';

// 特别注意，如果需要校验的某个属性的 value 是个对象，而且对象中有 constructor 作为 key，class-transformer
// 转换的时候会报错，暂时没有找到解决办法，将 ValidationPipe 改为了按需引入，不在全局引入
export class ValidationPipe extends ValidationPipeCommon {
  constructor(options?: ValidationPipeOptions) {
    super(options);
    this.exceptionFactory = errors => {
      console.log('errors', errors);
      if (errors.length > 0) {
        throw new GraphQLError(ApolloServerErrorCode.BAD_USER_INPUT, {
          extensions: {
            code: ApolloServerErrorCode.BAD_USER_INPUT,
            details: errors,
          },
        });
      }
    };
  }
}
