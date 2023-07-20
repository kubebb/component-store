/**
 * 由 src/kubernetes/gen/index.ts 自动生成
 * !!! 请不要修改 !!!
 */

import * as K8s from '@kubernetes/client-node';
import { Logger } from '@nestjs/common';
import {
  CreateOptions,
  DeleteCollectionOptions,
  DeleteCollectionSelectors,
  DeleteOptions,
  JsonPatchOp,
  ListOptions,
  PatchOptions,
  ReadOptions,
} from '../interfaces/core';
import {
  JSON_PATCH_CONTENT_TYPE,
  MERGE_PATCH_CONTENT_TYPE,
  STRATEGIC_MERGE_PATCH_CONTENT_TYPE,
} from '../utils/constants';

/**
 * @category core
 */
export class PersistentVolume {
  constructor(private readonly k8sApi: K8s.CoreV1Api) {}

  kind = 'PersistentVolume';
  name = 'persistentvolumes';
  namespaced = false;
  version = 'v1';
  logger = new Logger(this.kind);

  debug(message: string, ...optionalParams: [...any, string?]) {
    const paramsLog =
      optionalParams?.filter(param => param).length > 0 ? JSON.stringify(optionalParams) : '-';
    this.logger.debug(`${message} ${paramsLog}`);
  }

  /**
   * 创建 PersistentVolume
   *
   * @param {K8s.V1PersistentVolume} body PersistentVolume 对象
   * @param {CreateOptions} [options] 可选配置项
   */
  create(body: K8s.V1PersistentVolume, options?: CreateOptions) {
    this.debug('[create]', body, options);
    const { pretty, dryRun, fieldManager, fieldValidation, headers } = options || {};
    return this.k8sApi.createPersistentVolume(body, pretty, dryRun, fieldManager, fieldValidation, {
      headers,
    });
  }

  /**
   * 替换指定的 PersistentVolume
   *
   * @param {string} name PersistentVolume 名称
   * @param {K8s.V1PersistentVolume} body PersistentVolume 对象
   * @param {CreateOptions} [options] 可选配置项
   */
  replace(name: string, body: K8s.V1PersistentVolume, options?: CreateOptions) {
    this.debug(`[replace] ${name}`, body, options);
    const { pretty, dryRun, fieldManager, fieldValidation, headers } = options || {};
    return this.k8sApi.replacePersistentVolume(
      name,
      body,
      pretty,
      dryRun,
      fieldManager,
      fieldValidation,
      {
        headers,
      }
    );
  }

  /**
   * 部分更新指定的 PersistentVolume (JSON Patch)
   *
   * @param {string} name PersistentVolume 名称
   * @param {JsonPatchOp[]} body PersistentVolume 对象
   * @param {PatchOptions} [options] 可选配置项
   */
  patch(name: string, body: JsonPatchOp[], options?: PatchOptions) {
    this.debug(`[patch] ${name}`, body, options);
    const { pretty, dryRun, fieldManager, fieldValidation, force, headers } = options || {};
    return this.k8sApi.patchPersistentVolume(
      name,
      body,
      pretty,
      dryRun,
      fieldManager,
      fieldValidation,
      force,
      {
        headers: Object.assign({}, headers, {
          'Content-Type': JSON_PATCH_CONTENT_TYPE,
        }),
      }
    );
  }

  /**
   * 部分更新指定的 PersistentVolume (Merge Patch)
   *
   * @param {string} name PersistentVolume 名称
   * @param {object} body PersistentVolume 对象
   * @param {PatchOptions} [options] 可选配置项
   */
  patchMerge(name: string, body: object, options?: PatchOptions) {
    this.debug(`[patchMerge] ${name}`, body, options);
    const { pretty, dryRun, fieldManager, fieldValidation, force, headers } = options || {};
    return this.k8sApi.patchPersistentVolume(
      name,
      body,
      pretty,
      dryRun,
      fieldManager,
      fieldValidation,
      force,
      {
        headers: Object.assign({}, headers, {
          'Content-Type': MERGE_PATCH_CONTENT_TYPE,
        }),
      }
    );
  }

  /**
   * 部分更新指定的 PersistentVolume (Strategic Merge Patch)
   *
   * @param {string} name PersistentVolume 名称
   * @param {object} body PersistentVolume 对象
   * @param {PatchOptions} [options] 可选配置项
   */
  patchStrategicMerge(name: string, body: object, options?: PatchOptions) {
    this.debug(`[patchStrategicMerge] ${name}`, body, options);
    const { pretty, dryRun, fieldManager, fieldValidation, force, headers } = options || {};
    return this.k8sApi.patchPersistentVolume(
      name,
      body,
      pretty,
      dryRun,
      fieldManager,
      fieldValidation,
      force,
      {
        headers: Object.assign({}, headers, {
          'Content-Type': STRATEGIC_MERGE_PATCH_CONTENT_TYPE,
        }),
      }
    );
  }

  /**
   * 根据名称删除一个 PersistentVolume
   *
   * @param {string} name PersistentVolume 名称
   * @param {DeleteOptions} [options] 可选配置项
   */
  delete(name: string, options?: DeleteOptions) {
    this.debug(`[delete] ${name}`, options);
    const {
      pretty,
      dryRun,
      gracePeriodSeconds,
      orphanDependents,
      propagationPolicy,
      body,
      headers,
    } = options || {};
    return this.k8sApi.deletePersistentVolume(
      name,
      pretty,
      dryRun,
      gracePeriodSeconds,
      orphanDependents,
      propagationPolicy,
      body,
      { headers }
    );
  }

  // <remove is="Namespace">
  /**
   * 根据选择器删除多个 PersistentVolume
   *
   * @param {DeleteCollectionSelectors} [selectors] 选择器
   * @param {DeleteCollectionOptions} [options] 可选配置项
   */
  deleteCollection(selectors?: DeleteCollectionSelectors, options?: DeleteCollectionOptions) {
    this.debug('[deleteCollection]', selectors, options);
    const { fieldSelector, labelSelector } = selectors;
    const {
      pretty,
      _continue,
      dryRun,
      gracePeriodSeconds,
      limit,
      orphanDependents,
      propagationPolicy,
      resourceVersion,
      resourceVersionMatch,
      timeoutSeconds,
      body,
      headers,
    } = options || {};
    return this.k8sApi.deleteCollectionPersistentVolume(
      pretty,
      _continue,
      dryRun,
      fieldSelector,
      gracePeriodSeconds,
      labelSelector,
      limit,
      orphanDependents,
      propagationPolicy,
      resourceVersion,
      resourceVersionMatch,
      timeoutSeconds,
      body,
      { headers }
    );
  }
  // </remove is="Namespace">

  /**
   * 根据名称获取 PersistentVolume 详情
   *
   * @param {ListOptions} [options] 可选配置项
   */
  read(name: string, options?: ReadOptions) {
    this.debug(`[read] ${name}`, options);
    const { pretty, headers } = options || {};
    return this.k8sApi.readPersistentVolume(name, pretty, { headers });
  }

  /**
   * 列取 PersistentVolume 列表
   *
   * @param {ListOptions} [options] 可选配置项
   */
  list(options?: ListOptions) {
    this.debug('[list]', options);
    const {
      pretty,
      allowWatchBookmarks,
      _continue,
      fieldSelector,
      labelSelector,
      limit,
      resourceVersion,
      resourceVersionMatch,
      timeoutSeconds,
      watch,
      headers,
    } = options || {};
    return this.k8sApi.listPersistentVolume(
      pretty,
      allowWatchBookmarks,
      _continue,
      fieldSelector,
      labelSelector,
      limit,
      resourceVersion,
      resourceVersionMatch,
      timeoutSeconds,
      watch,
      { headers }
    );
  }
}
