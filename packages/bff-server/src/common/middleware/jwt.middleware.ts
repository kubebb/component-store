import { NextFunction, Request, Response } from '@/types';
import { Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { getAuthFromToken } from '../utils';

export async function JwtMiddleware(req: Request, _res: Response, next: NextFunction) {
  req.__reqId = nanoid();
  const { authorization } = req.headers;
  if (authorization) {
    const [tokenType, token] = authorization.split(/\s/);
    req.auth = getAuthFromToken(token);
    req.auth.tokenType = tokenType;
    req.auth.ip = req.ip;
    // const role = await this.usersService.getUserRole(req.auth);
    // req.auth.role = role;
  }
  next();
}
