import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { ServeStaticModule } from '@nestjs/serve-static';
import { Response } from 'express';
import { DirectiveLocation, GraphQLDirective } from 'graphql';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DataLoaderInterceptor } from './common/dataloader';
import { upperDirectiveTransformer } from './common/directives/upper-case.directive';
import { AllExceptionFilter } from './common/filters/all-exception.filter';
import { ComplexityPlugin } from './common/plugins/complexity.plugin';
import { ErrorFormatPlugin } from './common/plugins/error-format.plugin';
import { DateScalar } from './common/scalars/date.scalar';
import { JSONObjectScalar, JSONScalar } from './common/scalars/json.scalar';
import { GRAPHQL_PATH } from './common/utils';
import { ComponentsModule } from './components/components.module';
import serverConfig from './config/server.config';
import { KubernetesModule } from './kubernetes/kubernetes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [serverConfig],
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: [GRAPHQL_PATH],
      serveStaticOptions: {
        setHeaders: (res: Response) => {
          const url = res.req.url;
          if (
            url.includes('.') &&
            !url.startsWith('/profile/') &&
            !url.endsWith('.html') &&
            url !== '/favicon.ico'
          ) {
            res.setHeader('Cache-Control', 'public, max-age=604800, immutable');
          }
        },
      },
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      path: GRAPHQL_PATH,
      // 生产环境是否允许获取 schemas
      introspection: true,
      driver: ApolloDriver,
      // installSubscriptionHandlers: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      playground: {
        settings: {
          'request.credentials': 'same-origin',
          'tracing.hideTracingResponse': true,
          'queryPlan.hideQueryPlanResponse': true,
          'schema.polling.interval': 1000 * 60,
        },
      },
      transformSchema: schema => {
        // schema = authDirectiveTransformer(schema, 'auth');
        return upperDirectiveTransformer(schema, 'upper');
      },
      buildSchemaOptions: {
        directives: [
          new GraphQLDirective({
            name: 'upper',
            locations: [DirectiveLocation.FIELD_DEFINITION],
          }),
        ],
      },
      subscriptions: {
        'graphql-ws': {
          path: GRAPHQL_PATH,
        },
      },
    }),
    KubernetesModule,
    ComponentsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: DataLoaderInterceptor,
    },
    DateScalar,
    JSONScalar,
    JSONObjectScalar,
    ComplexityPlugin,
    ErrorFormatPlugin,
  ],
})
export class AppModule implements NestModule {
  configure() {
    //
  }
}
