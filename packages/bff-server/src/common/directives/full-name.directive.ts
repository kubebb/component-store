import { getDirective, MapperKind, mapSchema } from '@graphql-tools/utils';
import { GraphQLSchema } from 'graphql';

interface ResourceModel {
  name: string;
  displayName?: string;
  [key: string]: any;
}

export function fullNameDirectiveTransformer(schema: GraphQLSchema, directiveName: string) {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const fullNameDirective = getDirective(schema, fieldConfig, directiveName)?.[0];

      if (fullNameDirective) {
        fieldConfig.resolve = async function fieldResolver(source: ResourceModel) {
          const { name, displayName } = source;
          if (!displayName) {
            return name;
          }
          return `${displayName} (${name})`;
        };
        return fieldConfig;
      }
    },
  });
}
