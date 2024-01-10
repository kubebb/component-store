import { Injectable } from '@nestjs/common';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { AnyObj, JwtAuth, K8s } from 'src/types';
import { Configmap } from './models/configmap.model';

@Injectable()
export class ConfigmapService {
  constructor(private readonly k8sService: KubernetesService) {}

  format(cm: K8s.V1ConfigMap): Configmap {
    return {
      name: cm.metadata.name,
      data: cm.data,
      binaryData: cm.binaryData,
    };
  }

  async getConfigmap(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<Configmap> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.configMap.read(name, namespace);
    return this.format(body);
  }

  async createConfigmap(
    auth: JwtAuth,
    name: string,
    namespace: string,
    data: AnyObj,
    cluster?: string
  ): Promise<Configmap> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.configMap.create(namespace, {
      metadata: {
        name,
        namespace,
      },
      data,
    });
    return this.format(body);
  }

  async updateConfigmap(
    auth: JwtAuth,
    name: string,
    namespace: string,
    data: AnyObj,
    cluster?: string
  ): Promise<Configmap> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.configMap.patchMerge(name, namespace, {
      data,
    });
    return this.format(body);
  }

  async deleteConfigmap(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.configMap.delete(name, namespace);
    return true;
  }
}
