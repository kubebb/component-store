import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { json } from 'body-parser';
import helmet from 'helmet';
import { join } from 'path';
import { AppModule } from './app.module';
import { JwtMiddleware } from './common/middleware/jwt.middleware';
import { LoggerMiddleware } from './common/middleware/logger.middleware';
import { IS_PROD } from './common/utils';
import { serverConfig } from './config/server.config';
import ejs = require('ejs');

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: IS_PROD ? serverConfig.log.levels.split(',') : undefined,
  });

  app.enableCors({
    origin: true,
    credentials: true,
    // allowedHeaders: ['Authorization'],
  });

  app.useWebSocketAdapter(new WsAdapter(app));

  app.set('trust proxy', true);

  // ~ set ejs
  ejs.delimiter = '?';
  ejs.openDelimiter = '[';
  ejs.closeDelimiter = ']';
  app.engine('html', ejs.renderFile);
  app.setBaseViewsDir(join(__dirname, '..', 'public'));
  app.setViewEngine('html');

  app.use(json(serverConfig.bodyParser.json));

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
    })
  );

  app.use(JwtMiddleware);
  app.use(LoggerMiddleware);

  await app.listen(serverConfig.web.port);

  console.log(`component-store-bff-server is running on: ${await app.getUrl()}`);
}
bootstrap();
