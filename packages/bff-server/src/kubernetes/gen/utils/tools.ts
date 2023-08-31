import * as fs from 'fs';
import { compile, JSONSchema, Options } from 'json-schema-to-typescript';
import { FILE_HEADER } from './constants';

const _replaceSpecialName = (name: string) =>
  name
    .replace(/^VM/, 'vm')
    .replace(/^OAuth2/, 'oauth2')
    .replace(/^TF/, 'tf')
    .replace(/^IBPCA/, 'ibpca')
    .replace(/^IBPConsole/, 'ibpconsole')
    .replace(/^IBPOrderer/, 'ibporderer')
    .replace(/^IBPPeer/, 'ibppeer')
    .replace(/^ComponentPlan/, 'componentplan');
/**
 * 将命名转换为横线命名
 * TwoWords => two-words
 *
 * @param {string} name 名称
 */
export const toKebabCase = (name: string) => {
  name = _replaceSpecialName(name);
  return name
    .replace(/([A-Z])/g, '-$1')
    .toLowerCase()
    .replace(/^\-/, '');
};

/**
 * 将命名转换为首字母小写
 * TwoWords => twoWords
 *
 * @param {string} name 名称
 */
export const firstLetterToLowercase = (name: string) => {
  name = _replaceSpecialName(name);
  const [first, ...rest] = name;
  return first.toLowerCase() + rest.join('');
};

export const getRegExp = (tagStart = '<remove>', tagEnd = '</remove>') =>
  new RegExp(`// ${tagStart}[\\s\\S]*// ${tagEnd}`, 'gu');

export const processContent = (name: string, content: string) => {
  // <remove>...</remove>
  content = content.replace(getRegExp(), '');
  // <remove is="...">...</remove>
  content = content.replace(getRegExp(`<remove is="${name}">`, `</remove is="${name}">`), '');
  return FILE_HEADER + content;
};

export const writeFile = (path: fs.PathOrFileDescriptor, data: string) =>
  fs.writeFile(path, data, err => {
    if (err) {
      console.error(`write ${path} failed`, err);
    }
  });

export const processContentAndWriteFile = (
  name: string,
  path: fs.PathOrFileDescriptor,
  data: string
) => writeFile(path, processContent(name, data));

export interface RsImport {
  rs: string;
  fileName: string;
}
export const writeRsImportsFile = (path: fs.PathOrFileDescriptor, rsImports: RsImport[]) =>
  writeFile(
    path,
    rsImports.map(({ rs, fileName }) => `export { ${rs} } from './${fileName}'`).join('\n')
  );

export const schemaToTs = (
  schema: JSONSchema | undefined,
  name: string,
  options?: Partial<Options>
): Promise<string> => {
  if (!schema) {
    return Promise.resolve(`
export type ${name} = any;

`);
  }
  return compile(schema, name, options);
};
