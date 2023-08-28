import { genNanoid } from '@/common/utils';
import serverConfig from '@/config/server.config';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { Secret } from '@/secret/models/secret.model';
import { SecretService } from '@/secret/secret.service';
import { AnyObj, CRD, JwtAuth } from '@/types';
import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { CreateRepositoryInput } from './dto/create-repository.input';
import { RepostoryArgs } from './dto/repository.args';
import { UpdateRepositoryInput } from './dto/update-repository.input';
import { RepositoryFilterOperation } from './models/repository-filter-operation';
import { RepositoryStatus } from './models/repository-status.enum';
import { PaginatedRepository, Repository } from './models/repository.model';

@Injectable()
export class RepositoryService {
  constructor(
    private readonly k8sService: KubernetesService,
    private readonly secretService: SecretService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}

  private kubebbNS = this.config.kubebb.namespace;

  formatRepository(repository: CRD.Repository, secret?: Secret): Repository {
    const conditions = repository.status?.conditions || [];
    const lastSuccessfulTime = conditions.find(
      c => c.lastSuccessfulTime && c.status === 'True' && c.type === 'Synced'
    )?.lastSuccessfulTime;
    let status = RepositoryStatus.unknown;
    if (conditions.find(c => c.type === 'Synced' && c.status === 'True')) {
      status = RepositoryStatus.synced_true;
    } else if (conditions.find(c => c.type === 'Synced' && c.status === 'False')) {
      status = RepositoryStatus.synced_false;
    } else if (
      conditions.find(c => c.type === 'Ready' && c.status === 'True' && c.reason === 'Creating')
    ) {
      status = RepositoryStatus.ready_true;
    } else if (conditions.find(c => c.type === 'Ready' && c.status === 'False')) {
      status = RepositoryStatus.ready_false;
    }
    const filter = repository.spec?.filter?.map(f => {
      let op: string;
      if (f.versionedFilterCond) {
        op =
          f.operation === 'ignore'
            ? RepositoryFilterOperation.ignore_exact
            : RepositoryFilterOperation.keep_exact;
      } else {
        op = RepositoryFilterOperation.ignore_all;
      }
      return {
        name: f.name,
        keepDeprecated: f.keepDeprecated,
        operation: op,
        regexp: f.versionedFilterCond?.regexp,
        versions: f.versionedFilterCond?.versions,
        versionConstraint: f.versionedFilterCond?.versionConstraint,
      };
    });
    const imageOverride = repository.spec?.imageOverride?.map(m => ({
      registry: m.registry,
      newRegistry: m.newRegistry,
      newPath: m.pathOverride?.newPath,
      path: m.pathOverride?.path,
    }));
    return {
      name: repository.metadata.name,
      repositoryType: repository.spec?.repositoryType,
      url: repository.spec?.url,
      creationTimestamp: new Date(repository.metadata.creationTimestamp).toISOString(),
      lastSuccessfulTime: lastSuccessfulTime ? new Date(lastSuccessfulTime).toISOString() : null,
      status,
      pullStategy: repository.spec?.pullStategy,
      filter,
      imageOverride,
      password: secret?.data?.password,
      username: secret?.data?.username,
      insecure: repository?.spec?.insecure,
      authSecret: repository?.spec?.authSecret,
    };
  }

  async getRepositoriesPaged(auth: JwtAuth, args: RepostoryArgs): Promise<PaginatedRepository> {
    const { page = 1, pageSize = 20, name, statuses, repositoryTypes, cluster } = args;
    const res = await this.getRepositories(auth, { name }, cluster);
    const filteredRes = res?.filter(
      r =>
        (!statuses || statuses?.includes(r.status)) &&
        (!repositoryTypes || repositoryTypes?.includes(r.repositoryType))
    );
    const totalCount = filteredRes?.length;
    return {
      totalCount,
      hasNextPage: page * pageSize < totalCount,
      nodes: filteredRes?.slice((page - 1) * pageSize, page * pageSize),
    };
  }

  async getRepositories(
    auth: JwtAuth,
    args?: RepostoryArgs,
    cluster?: string
  ): Promise<Repository[]> {
    let fieldSelector: string;
    if (args?.name) {
      fieldSelector = `metadata.name=${args.name}`;
    }
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.repository.list(this.kubebbNS, {
      fieldSelector,
    });
    return body.items?.map(item => this.formatRepository(item));
  }

  async getRepository(auth: JwtAuth, name: string, cluster?: string): Promise<Repository> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.repository.read(name, this.kubebbNS);
    let secret: Secret;
    if (body.spec?.authSecret) {
      secret = await this.secretService.getSecretDetail(
        auth,
        body.spec.authSecret,
        this.kubebbNS,
        cluster
      );
    }
    return this.formatRepository(body, secret);
  }

  async create(
    auth: JwtAuth,
    repository: CreateRepositoryInput,
    cluster?: string
  ): Promise<Repository> {
    const {
      name,
      url,
      repositoryType,
      insecure,
      pullStategy,
      imageOverride,
      filter,
      certData,
      username,
      password,
    } = repository;
    const specFilter = filter?.map(f => {
      let op: 'ignore' | 'keep';
      let cond: AnyObj;
      if (f.operation === RepositoryFilterOperation.ignore_all) {
        op = 'ignore';
      } else {
        op = f.operation === RepositoryFilterOperation.ignore_exact ? 'ignore' : 'keep';
        cond = { regexp: f.regexp, versionConstraint: f.versionConstraint, versions: f.versions };
      }
      return {
        name: f?.name,
        keepDeprecated: f?.keepDeprecated,
        operation: op,
        versionedFilterCond: cond,
      };
    });
    const specImgOver = imageOverride?.map(m => ({
      registry: m.registry,
      newRegistry: m.newRegistry,
      pathOverride: { path: m.path, newPath: m.newPath },
    }));
    const k8s = await this.k8sService.getClient(auth, { cluster });

    // TODO: create secret with cert
    let secretName: string;
    if (username || password || certData) {
      secretName = genNanoid('repository');
      await this.secretService.createSecret(
        auth,
        {
          name: secretName,
          namespace: this.kubebbNS,
          data: {
            username,
            password,
          },
        },
        cluster
      );
    }

    const { body } = await k8s.repository.create(this.kubebbNS, {
      metadata: {
        name,
      },
      spec: {
        url,
        repositoryType,
        insecure,
        authSecret: secretName,
        pullStategy,
        imageOverride: specImgOver,
        filter: specFilter,
      },
    });
    return this.formatRepository(body);
  }

  async update(
    auth: JwtAuth,
    name: string,
    repository: UpdateRepositoryInput,
    cluster?: string
  ): Promise<Repository> {
    const { insecure, pullStategy, imageOverride, filter, certData, username, password } =
      repository;
    const { specFilter, specImgOver } = this.parseSpec({ filter, imageOverride });
    const { url, repositoryType, authSecret } = await this.getRepository(auth, name, cluster);
    let secretName = authSecret;
    // TODO: update secret with cert
    if (certData || username || password) {
      if (authSecret) {
        await this.secretService.updateSecret(
          auth,
          authSecret,
          this.kubebbNS,
          {
            data: {
              username,
              password,
            },
          },
          cluster
        );
      } else {
        secretName = genNanoid('repository');
        await this.secretService.createSecret(
          auth,
          {
            name: secretName,
            namespace: this.kubebbNS,
            data: {
              username,
              password,
            },
          },
          cluster
        );
      }
    }

    const k8s = await this.k8sService.getClient(auth, { cluster });
    const { body } = await k8s.repository.patchMerge(name, this.kubebbNS, {
      spec: {
        url,
        repositoryType,
        insecure,
        authSecret: secretName,
        pullStategy,
        imageOverride: specImgOver,
        filter: specFilter,
      },
    });
    return this.formatRepository(body);
  }

  async remove(auth: JwtAuth, name: string, cluster?: string): Promise<boolean> {
    const k8s = await this.k8sService.getClient(auth, { cluster });
    await k8s.repository.delete(name, this.kubebbNS);
    return true;
  }

  parseSpec({ filter, imageOverride }: UpdateRepositoryInput) {
    const specFilter = filter?.map(f => {
      let op: 'ignore' | 'keep';
      let cond: AnyObj;
      if (f.operation === RepositoryFilterOperation.ignore_all) {
        op = 'ignore';
      } else {
        op = f.operation === RepositoryFilterOperation.ignore_exact ? 'ignore' : 'keep';
        cond = { regexp: f.regexp, versionConstraint: f.versionConstraint, versions: f.versions };
      }
      return {
        name: f?.name,
        keepDeprecated: f?.keepDeprecated,
        operation: op,
        versionedFilterCond: cond,
      };
    });
    const specImgOver = imageOverride?.map(m => ({
      registry: m.registry,
      newRegistry: m.newRegistry,
      pathOverride: { path: m.path, newPath: m.newPath },
    }));
    return { specFilter, specImgOver };
  }
}
