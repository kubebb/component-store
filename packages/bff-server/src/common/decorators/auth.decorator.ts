import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Request } from '../../types';
import { TokenException } from '../utils';

export const Auth = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request: Request = GqlExecutionContext.create(ctx).getContext().req;
  const { auth } = request;
  if (!auth) {
    throw new TokenException('The authentication field in the request header is required');
  }
  return request.auth;
});
