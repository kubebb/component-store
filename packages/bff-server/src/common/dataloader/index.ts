import {
  CallHandler,
  createParamDecorator,
  ExecutionContext,
  Injectable,
  InternalServerErrorException,
  NestInterceptor,
  Type,
  UnauthorizedException,
} from '@nestjs/common';
import { APP_INTERCEPTOR, ContextId, ContextIdFactory, ModuleRef } from '@nestjs/core';
import { GqlContextType, GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { JwtAuth, Request } from 'src/types';
import DataLoader = require('dataloader');

/**
 * https://github.com/TreeMan360/nestjs-graphql-dataloader/blob/master/src/index.ts
 */

export interface NestDataLoader<ID, Type> {
  generateDataLoader(auth: JwtAuth): DataLoader<ID, Type>;
}

const NEST_DATA_LOADER_CONTEXT_KEY = 'NEST_DATA_LOADER_CONTEXT_KEY';

interface DataLoaderFactory {
  (contextId: ContextId, type: Type<NestDataLoader<any, any>>): Promise<DataLoader<any, any>>;
}

export class NestDataLoaderContext {
  private readonly id: ContextId = ContextIdFactory.create();
  private readonly cache: Map<Type<NestDataLoader<any, any>>, Promise<DataLoader<any, any>>> =
    new Map<Type<NestDataLoader<any, any>>, Promise<DataLoader<any, any>>>();

  constructor(private readonly dataloaderFactory: DataLoaderFactory) {}

  async clearAll() {
    for (const loaderPromise of this.cache.values()) {
      const loader = await loaderPromise;
      loader.clearAll();
    }
  }

  getLoader(type: Type<NestDataLoader<any, any>>): Promise<DataLoader<any, any>> {
    let loader = this.cache.get(type);
    if (!loader) {
      loader = this.dataloaderFactory(this.id, type);
      this.cache.set(type, loader);
    }
    return loader;
  }
}

@Injectable()
export class DataLoaderInterceptor implements NestInterceptor {
  constructor(private readonly moduleRef: ModuleRef) {}

  public intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> {
    if (context.getType<GqlContextType>() !== 'graphql') {
      return next.handle();
    }

    const ctx = GqlExecutionContext.create(context).getContext();
    const request: Request = ctx.req;

    if (ctx[NEST_DATA_LOADER_CONTEXT_KEY] === undefined) {
      ctx[NEST_DATA_LOADER_CONTEXT_KEY] = new NestDataLoaderContext(
        this.createDataLoader.bind(this, request.auth)
      );
    }

    return next.handle();
  }

  private async createDataLoader(
    auth: JwtAuth,
    contextId: ContextId,
    type: Type<NestDataLoader<any, any>>
  ): Promise<DataLoader<any, any>> {
    if (!auth) {
      throw new UnauthorizedException('The authentication field in the request header is required');
    }
    try {
      const provider = await this.moduleRef.resolve<NestDataLoader<any, any>>(type, contextId, {
        strict: false,
      });

      return provider.generateDataLoader(auth);
    } catch (e) {
      throw new InternalServerErrorException(`The loader ${type} is not provided` + e);
    }
  }
}

function getNestDataLoaderContext(context: ExecutionContext): NestDataLoaderContext {
  if (context.getType<GqlContextType>() !== 'graphql') {
    throw new InternalServerErrorException(
      '@Loader should only be used within the GraphQL context'
    );
  }

  const graphqlContext = GqlExecutionContext.create(context).getContext();

  const nestDataLoaderContext = graphqlContext[NEST_DATA_LOADER_CONTEXT_KEY];
  if (!nestDataLoaderContext) {
    throw new InternalServerErrorException(
      `You should provide interceptor ${DataLoaderInterceptor.name} globally with ${APP_INTERCEPTOR}`
    );
  }

  return nestDataLoaderContext;
}

export const Loader = createParamDecorator(
  (
    data: Type<NestDataLoader<any, any>>,
    context: ExecutionContext
  ): Promise<DataLoader<any, any>> => {
    if (!data) {
      throw new InternalServerErrorException(`No loader provided to @Loader ('${data}')`);
    }
    return getNestDataLoaderContext(context).getLoader(data);
  }
);

export const LoaderContext = createParamDecorator(
  (data: any, context: ExecutionContext): NestDataLoaderContext => {
    return getNestDataLoaderContext(context);
  }
);

export const ensureOrder = (options: any) => {
  const { docs, keys, prop, oLoader } = options;

  const docsMap = new Map();
  docs.forEach((doc: any) => {
    oLoader.clear(doc[prop]).prime(doc[prop], doc);
    docsMap.set(doc[prop], doc);
  });
  return keys.map((key: string) => {
    return docsMap.get(key);
  });
};

interface IOrderedNestDataLoaderOptions<ID, Type> {
  propertyKey?: string;
  query: (keys: readonly ID[]) => Promise<Type[]>;
  typeName?: string;
  dataloaderConfig?: DataLoader.Options<ID, Type>;
}

export abstract class OrderedNestDataLoader<ID, Type> implements NestDataLoader<ID, Type> {
  protected abstract getOptions: (auth: JwtAuth) => IOrderedNestDataLoaderOptions<ID, Type>;

  public generateDataLoader(auth: JwtAuth): DataLoader<ID, Type, ID> {
    return this.createLoader(this.getOptions(auth));
  }

  protected createLoader(options: IOrderedNestDataLoaderOptions<ID, Type>): DataLoader<ID, Type> {
    const defaultTypeName = this.constructor.name.replace('Loader', '');
    const loader = new DataLoader<ID, Type>(async keys => {
      loader.clearAll();
      return ensureOrder({
        docs: await options.query(keys),
        oLoader: loader,
        keys,
        prop: options.propertyKey || 'id',
        error: keyValue => `${options.typeName || defaultTypeName} does not exist ${keyValue}`,
      });
    }, options.dataloaderConfig);

    // add undefined value filter for loadMany
    const loadMany: (keys: ArrayLike<ID>) => Promise<Array<Type | Error>> =
      loader.loadMany.bind(loader);
    async function _loadMany(keys: ArrayLike<ID>): Promise<Array<Type | Error>> {
      const dataList = await loadMany(keys);
      return dataList.filter(d => !!d);
    }
    loader.loadMany = _loadMany;

    return loader;
  }
}
