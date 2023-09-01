import { message } from 'antd';

import { notification } from '@tenx-ui/materials';

import { getAuthData, isTokenExpired, removeAuthData, setAuthData } from '@tenx-ui/auth-utils';

import { sdk as bff } from '@tenx-ui/component-store-bff-client';

import { sdk as bffSdk } from '@tenx-ui/bff-client';

import { createRef } from 'react';

const utils = {};

utils.message = message;

utils.notification = notification;

utils.getAuthData = getAuthData;

utils.setAuthData = setAuthData;

utils.removeAuthData = removeAuthData;

utils.isTokenExpired = isTokenExpired;

/** 获取 Authorization header */
utils.getAuthorization = function __getAuthorization() {
  return () => {
    const authData = this.getAuthData();
    const { token_type, id_token } = authData.token || {};
    const Authorization = token_type && id_token && `${token_type} ${id_token}`;
    return Authorization;
  };
}.apply(utils);
export const getAuthorization = utils.getAuthorization;

/** 获取 axios 默认配置，也可在配置中指定拦截器，用于数据源初始化 axios handler */
utils.getAxiosHanlderConfig = function __getAxiosHanlderConfig() {
  return () => ({
    // 详细配置见：http://dev-npm.tenxcloud.net/-/web/detail/@yunti/lowcode-datasource-axios-handler
    interceptors: {
      request: [
        {
          onFulfilled: config => {
            if (!config.headers.get('Authorization')) {
              config.headers.set('Authorization', this.getAuthorization());
            }
            return config;
          },
        },
      ],
    },
  });
}.apply(utils);
export const getAxiosHanlderConfig = utils.getAxiosHanlderConfig;

/** 组件仓库管理状态 */
utils.getComponentWarehouseStatus = function __getComponentWarehouseStatus() {
  return (pageThis, isStatus) => {
    return [
      // 健康
      {
        [isStatus ? 'id' : 'value']: 'synced_true',
        type: 'success',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-ald3kpof'),
      },
      // 未知
      {
        [isStatus ? 'id' : 'value']: 'unknown',
        type: 'disabled',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-tc7m2mdu'),
      },
      // 同步中
      {
        [isStatus ? 'id' : 'value']: 'ready_true',
        type: 'primary',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-cfk35lik'),
      },
      // 异常-同步异常
      {
        [isStatus ? 'id' : 'value']: 'synced_false',
        type: 'error',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-0durb4cn'),
      },
      // 异常-chart包获取异常
      {
        [isStatus ? 'id' : 'value']: 'ready_false',
        type: 'error',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-licl8v3n'),
      },
    ];
  };
}.apply(utils);
export const getComponentWarehouseStatus = utils.getComponentWarehouseStatus;

/** 组件仓库管理类型 */
utils.getComponentWarehouseTypes = function __getComponentWarehouseTypes() {
  return (pageThis, isStatus) => {
    return [
      {
        [isStatus ? 'id' : 'value']: 'Git',
        [isStatus ? 'children' : 'text']: 'Git',
      },
      {
        [isStatus ? 'id' : 'value']: 'Chart Museum',
        [isStatus ? 'children' : 'text']: 'Chart Museum',
      },
    ];
  };
}.apply(utils);
export const getComponentWarehouseTypes = utils.getComponentWarehouseTypes;

/** 组件类型 */
utils.getComponentTypes = function __getComponentTypes() {
  return (pageThis, isStatus, isTag) => {
    return [
      // 官方
      {
        color: 'processing',
        [isStatus ? 'id' : 'value']: 'official',
        [isStatus || isTag ? 'children' : 'text']: pageThis.i18n('i18n-uvq3yb8j'),
      },
    ];
  };
}.apply(utils);
export const getComponentTypes = utils.getComponentTypes;

/** 组件发布状态 */
utils.getComponentPublishStatus = function __getComponentPublishStatus() {
  return (pageThis, isStatus) => {
    return [
      {
        [isStatus ? 'id' : 'value']: 'ready',
        type: 'success',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-3uhh6hke'),
      },
      {
        [isStatus ? 'id' : 'value']: 'feiqi',
        type: 'error',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-zgk1d4r3'),
      },
      // {
      //   [isStatus ? "id" : 'value']: "yichang",
      //   "type": "warning",
      //   [isStatus ? "children" : 'text']: pageThis.i18n('i18n-2uobywml'),
      // },
      {
        [isStatus ? 'id' : 'value']: 'syncing',
        type: 'primary',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-cfk35lik'),
        tooltip: pageThis.i18n('i18n-mrohje35'),
      },
    ];
  };
}.apply(utils);
export const getComponentPublishStatus = utils.getComponentPublishStatus;

/** 组件安装方法  */
utils.getComponentInstallMethods = function __getComponentInstallMethods() {
  return (pageThis, isStatus) => {
    return [
      {
        [isStatus ? 'id' : 'value']: '手动',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-giwyayqp'),
      },
      {
        [isStatus ? 'id' : 'value']: '自动',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-rwa0ty3e'),
      },
    ];
  };
}.apply(utils);
export const getComponentInstallMethods = utils.getComponentInstallMethods;

/** 组件订阅状态 */
utils.getComponentSubscriptionStatus = function __getComponentSubscriptionStatus() {
  return (pageThis, isStatus) => {
    return [
      {
        [isStatus ? 'id' : 'value']: '已订阅',
        type: 'primary',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-9h0g7w2u'),
      },
      {
        [isStatus ? 'id' : 'value']: '异常',
        type: 'error',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-2uobywml'),
      },
    ];
  };
}.apply(utils);
export const getComponentSubscriptionStatus = utils.getComponentSubscriptionStatus;

/** 组件安装状态 */
utils.getComponentInstallStatus = function __getComponentInstallStatus() {
  return (pageThis, isStatus) => {
    return [
      {
        [isStatus ? 'id' : 'value']: '待安装',
        type: 'disabled',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-jmkpjhx8'),
      },
      {
        [isStatus ? 'id' : 'value']: '安装成功',
        type: 'success',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-ydulo8tp'),
      },
      {
        [isStatus ? 'id' : 'value']: '安装中',
        type: 'primary',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-7fw4lwae'),
      },
      {
        [isStatus ? 'id' : 'value']: '安装失败',
        type: 'error',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-r147hejk'),
        tooltip: pageThis.i18n('i18n-mrohje35'),
      },
      {
        [isStatus ? 'id' : 'value']: '可升级',
        type: 'warning',
        [isStatus ? 'children' : 'text']: pageThis.i18n('i18n-81c0tben'),
      },
    ];
  };
}.apply(utils);
export const getComponentInstallStatus = utils.getComponentInstallStatus;

utils.bff = bff;

/** 修改地址栏参数 */
utils.changeLocationQuery = function __changeLocationQuery() {
  return (pageThis, func, _search) => {
    try {
      const locationSearch = {};
      const help = pageThis.appHelper;
      help?.location?.search
        ?.slice(1)
        ?.split('&')
        ?.forEach(item => {
          if (item.split('=')[0] === '_search') {
            locationSearch[item.split('=')[0]] = JSON.parse(decodeURI(item.split('=')[1]) || '{}');
          } else {
            locationSearch[item.split('=')[0]] = item.split('=')[1];
          }
        });
      const newQuery = {
        ...(locationSearch || {}),
        _search: JSON.stringify({
          ...((locationSearch || {})?._search || {}),
          ...(_search || {}),
        }),
      };
      const path =
        help?.match?.pathname +
        '?' +
        Object.keys(newQuery || {})
          ?.filter(key => key && newQuery[key])
          ?.map(key => `${key}=${newQuery[key]}`)
          ?.join('&');
      help.history?.replace(path);
    } catch (e) {}
  };
}.apply(utils);
export const changeLocationQuery = utils.changeLocationQuery;

/** 名称校验(由min~max个小写字母、数字、中划线“-”或点“.”组成，并以字母、数字开头或结尾) */
utils.getNameReg = function __getNameReg() {
  return ({ min = 3, max = 63 }) => {
    return `^([a-z0-9]{1}[-a-z0-9.]{${min > 2 ? min - 2 : 0},${max - 2}})?[a-z0-9]{1}$`;
  };
}.apply(utils);
export const getNameReg = utils.getNameReg;

/** base64 加密 */
utils.encodeBase64 = function __encodeBase64() {
  return str => btoa(encodeURIComponent(str));
}.apply(utils);
export const encodeBase64 = utils.encodeBase64;

/** base64 解码 */
utils.decodeBase64 = function __decodeBase64() {
  return str => decodeURIComponent(atob(str));
}.apply(utils);
export const decodeBase64 = utils.decodeBase64;

/** 读取文件内容 */
utils.readFile = function __readFile() {
  return (file, callback) => {
    if (!file?.originFileObj) {
      return callback();
    }
    const reader = new FileReader();
    reader.readAsText(file?.originFileObj, 'UTF-8');
    reader.onload = evt => {
      callback(evt.target.result);
    };
  };
}.apply(utils);
export const readFile = utils.readFile;

/** 非空校验 */
utils.validator = function __validator() {
  return (value, i18nKey) => {
    if (!value) {
      return this.i18n(i18nKey);
    }
  };
}.apply(utils);
export const validator = utils.validator;

utils.bffSdk = bffSdk;

export class RefsManager {
  constructor() {
    this.refInsStore = {};
  }

  clearNullRefs() {
    Object.keys(this.refInsStore).forEach(refName => {
      const filteredInsList = this.refInsStore[refName].filter(insRef => !!insRef.current);
      if (filteredInsList.length > 0) {
        this.refInsStore[refName] = filteredInsList;
      } else {
        delete this.refInsStore[refName];
      }
    });
  }

  get(refName) {
    this.clearNullRefs();
    if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
      return this.refInsStore[refName][0].current;
    }

    return null;
  }

  getAll(refName) {
    this.clearNullRefs();
    if (this.refInsStore[refName] && this.refInsStore[refName].length > 0) {
      return this.refInsStore[refName].map(i => i.current);
    }

    return [];
  }

  linkRef(refName) {
    const refIns = createRef();
    this.refInsStore[refName] = this.refInsStore[refName] || [];
    this.refInsStore[refName].push(refIns);
    return refIns;
  }
}
utils.RefsManager = RefsManager;

export default {
  bff,

  message,

  notification,

  getAuthData,

  setAuthData,

  removeAuthData,

  isTokenExpired,

  getAuthorization,

  getAxiosHanlderConfig,

  getComponentWarehouseStatus,

  getComponentWarehouseTypes,

  getComponentTypes,

  getComponentPublishStatus,

  getComponentInstallMethods,

  getComponentSubscriptionStatus,

  getComponentInstallStatus,

  bff,

  changeLocationQuery,

  getNameReg,

  encodeBase64,

  decodeBase64,

  readFile,

  validator,

  bffSdk,
};
