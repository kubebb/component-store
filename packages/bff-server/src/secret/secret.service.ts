import { Cluster, V1Secret } from '@kubernetes/client-node';
import { Injectable } from '@nestjs/common';
import { isBase64 } from 'class-validator';
import { decodeBase64 } from 'src/common/utils';
import { KubernetesService } from 'src/kubernetes/kubernetes.service';
import { JwtAuth } from 'src/types';
import { NewSecretInput } from './dto/new-secret.input';
import { UpdateSecretInput } from './dto/update-secret.input';
import { Secret } from './models/secret.model';

@Injectable()
export class SecretService {
  constructor(private readonly k8sService: KubernetesService) {}

  formatSecret(secret: V1Secret): Secret {
    return {
      name: secret.metadata.name,
      data: secret.data,
    };
  }

  async getSecretDetail(
    auth: JwtAuth,
    name: string,
    namespace: string,
    cluster?: string
  ): Promise<Secret> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body: secret } = await k8s.secret.read(name, namespace);
    return this.formatSecret(secret);
  }

  async createSecret(auth: JwtAuth, secret: NewSecretInput, cluster?: string): Promise<Secret> {
    const { name, namespace, data } = secret;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.secret.create(namespace, {
      metadata: {
        name,
      },
      data,
    });
    return this.formatSecret(body);
  }

  async updateSecret(
    auth: JwtAuth,
    name: string,
    namespace: string,
    secret: UpdateSecretInput,
    cluster?: string
  ): Promise<Secret> {
    const { data } = secret;
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.secret.patchMerge(name, namespace, {
      data,
    });
    return this.formatSecret(body);
  }
  async verifyToken(token: string, cluster: Cluster, authIp: string): Promise<boolean> {
    const _token = isBase64(token) ? decodeBase64(token) : token;
    const k8s = await this.k8sService.getClient(
      {
        token: _token,
        name: '',
        ip: authIp,
      },
      { cluster }
    );
    const { body } = await k8s.authenticationV1Api.createTokenReview({
      apiVersion: 'authentication.k8s.io/v1',
      kind: 'TokenReview',
      spec: {
        token: _token,
      },
    });
    return body.status.authenticated;
  }
}
