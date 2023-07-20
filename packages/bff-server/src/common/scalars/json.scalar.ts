/**
 * JSON scalar
 *
 * https://github.com/taion/graphql-type-json/blob/10418fa03875947140d1c0bd8b8de51926252e35/src/index.js
 */
import { CustomScalar, Scalar } from '@nestjs/graphql';
import { Kind, ObjectValueNode, print, ValueNode } from 'graphql';
import { Maybe } from 'graphql/jsutils/Maybe';

type Variables = Maybe<{ [key: string]: any }>;

const identity = (value: any) => {
  return value;
};

const ensureObject = (value: any) => {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    throw new TypeError(`JSONObject cannot represent non-object value: ${value}`);
  }

  return value;
};

const parseObject = (typeName: string, ast: ValueNode, variables: Variables) => {
  const value = Object.create(null);
  (ast as ObjectValueNode).fields.forEach(field => {
    value[field.name.value] = parseLiteral(typeName, field.value, variables);
  });

  return value;
};

const parseLiteral = (typeName: string, ast: ValueNode, variables: Variables) => {
  switch (ast.kind) {
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.INT:
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.OBJECT:
      return parseObject(typeName, ast, variables);
    case Kind.LIST:
      return ast.values.map(n => parseLiteral(typeName, n, variables));
    case Kind.NULL:
      return null;
    case Kind.VARIABLE:
      return variables ? variables[ast.name.value] : undefined;
    default:
      throw new TypeError(`${typeName} cannot represent value: ${print(ast)}`);
  }
};

@Scalar('JSON', () => JSON)
export class JSONScalar implements CustomScalar<any, any> {
  description: 'The `JSON` scalar type represents JSON values as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).';

  specifiedByUrl: 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf';

  parseValue(value: any): any {
    return identity(value); // value from the client
  }

  serialize(value: any): any {
    return identity(value); // value sent to the client
  }

  parseLiteral(ast: ValueNode, variables: Variables) {
    parseLiteral('JSON', ast, variables);
  }
}

@Scalar('JSONObject')
export class JSONObjectScalar implements CustomScalar<any, any> {
  description: 'The `JSONObject` scalar type represents JSON objects as specified by [ECMA-404](http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf).';

  specifiedByUrl: 'http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-404.pdf';

  parseValue(value: any): any {
    return ensureObject(value); // value from the client
  }

  serialize(value: any): any {
    return ensureObject(value); // value sent to the client
  }

  parseLiteral(ast: ValueNode, variables: Variables): any {
    if (ast.kind !== Kind.OBJECT) {
      throw new TypeError(`JSON cannot represent non-object value: ${print(ast)}`);
    }

    return parseObject('JSONObject', ast, variables);
  }
}
