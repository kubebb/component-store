const _ = require('lodash');
const schema = require('./schema.json');

const x = _.toPairs(schema);
console.log('x', x);

const i18nKeys = {
  //
};
var i = 0;
const addKeyToI18n = (key, value) => {
  i++;
  console.log(i);
  if (!i18nKeys[key]) {
    i18nKeys[key] = [value];
    return i18nKeys;
  }
  i18nKeys[key].push(value);
  return i18nKeys;
};

const xx = (s, path = []) =>
  Object.entries(s).forEach(([key, values]) => {
    if (typeof values !== 'object') {
      return;
    }
    if (values.type === 'i18n' && values.key?.startsWith('i18n-')) {
      addKeyToI18n(values.key, [...path, key]);
    } else if (values.type === 'JSFunction') {
      const m = values.value?.match(/i18n\(['|"]i18n\-[a-z,0-9]+['|"]\)/g);
      if (m?.length > 0) {
        m.forEach(mm => {
          const key = mm.replace(/^i18n\(['|"]/, '').replace(/['|"]\)$/, '');
          addKeyToI18n(key, [...path, key, 'value']);
        });
      }
    }
    xx(values, [...path, key]);
  });

xx(schema);
console.log(JSON.stringify(i18nKeys, null, 2));
