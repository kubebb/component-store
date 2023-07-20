import { NextFunction, Request, Response } from '@/types';
import { Logger } from '@nestjs/common';
import { nanoid } from 'nanoid';
import { genUserLogString, GRAPHQL_PATH } from '../utils';

export async function LoggerMiddleware(req: Request, res: Response, next: NextFunction) {
  const startTime = Date.now();
  req.__reqId = nanoid();
  const userLogStr = genUserLogString(req);
  Logger.log(`--> ${userLogStr}`);
  if (req.path === GRAPHQL_PATH) {
    const query = req.body?.query || '-';
    Logger.debug(`--> ${userLogStr} ${query}`, req.body?.variables);
  }
  res.on('finish', () => {
    const time = Date.now() - startTime;
    Logger.log(`<-- ${userLogStr} [${res.statusCode}] ${time}ms`);
  });
  next();
}
