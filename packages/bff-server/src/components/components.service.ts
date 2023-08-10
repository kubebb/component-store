import serverConfig from '@/config/server.config';
import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { RepositoryService } from '@/repository/repository.service';
import { CRD, JwtAuth } from '@/types';
import { HttpException, Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { IncomingHttpHeaders } from 'http';
import * as urllib from 'urllib';
import { RequestOptions } from 'urllib';
import { ComponentArgs } from './dto/component.args';
import { CreateComponentInput } from './dto/create-component.input';
import { DeleteComponentInput } from './dto/delete-component.input';
import { Component, PaginatedComponent } from './models/component.model';

@Injectable()
export class ComponentsService {
  constructor(
    private readonly k8sService: KubernetesService,
    private readonly repositoryService: RepositoryService,
    @Inject(serverConfig.KEY)
    private config: ConfigType<typeof serverConfig>
  ) {}

  private logger = new Logger('ComponentsService');
  private kubebbNS = this.config.kubebb.namespace;

  formatComponent(c: CRD.Component): Component {
    return {
      name: c.metadata?.name,
      chartName: c.status?.name,
      description: c.status?.description,
      deprecated: c.status?.deprecated,
      icon: c.status?.icon,
      keywords: c.status?.keywords,
      home: c.status?.home,
      sources: c.status?.sources,
      versions: c.status?.versions,
      maintainers: c.status?.maintainers,
      creationTimestamp: new Date(c.metadata?.creationTimestamp).toISOString(),
    };
  }

  async listComponents(auth: JwtAuth): Promise<Component[]> {
    const k8s = await this.k8sService.getClient(auth);
    const { body } = await k8s.component.list(this.kubebbNS);
    return body.items
      ?.map(t => this.formatComponent(t))
      ?.sort(
        (a, b) => new Date(b.creationTimestamp).valueOf() - new Date(a.creationTimestamp).valueOf()
      );
  }

  async getComponentsPaged(auth: JwtAuth, args: ComponentArgs): Promise<PaginatedComponent> {
    const { page, pageSize, name, chartName } = args;
    const res = await this.listComponents(auth);
    const filteredRes = res?.filter(
      t => (!name || t.name?.includes(name)) && (!chartName || t.chartName?.includes(chartName))
    );
    const totalCount = filteredRes.length;
    return {
      totalCount,
      hasNextPage: page * pageSize < totalCount,
      nodes: filteredRes.slice((page - 1) * pageSize, page * pageSize),
    };
  }

  async getComponent(auth: JwtAuth, name: string): Promise<Component> {
    const k8s = await this.k8sService.getClient(auth);
    const { body } = await k8s.component.read(name, this.kubebbNS);
    return this.formatComponent(body);
  }

  /**
   * 通过「POST /api/charts - upload a new chart version」创建 Component
   * 参考 https://github.com/helm/chartmuseum
   */
  async uploadChart(auth: JwtAuth, chart: CreateComponentInput): Promise<boolean> {
    const { repository, file } = chart;
    const { createReadStream } = await file;
    const { url } = await this.repositoryService.getRepository(auth, repository);
    // TODO: username password
    await this.callChartMuseum(`${url}/api/charts`, {
      method: 'POST',
      content: createReadStream(),
    });
    return true;
  }

  /**
   * 通过「DELETE /api/charts/<name>/<version> - delete a chart version (and corresponding provenance file)」删除 Component
   */
  async deleteChart(auth: JwtAuth, chart: DeleteComponentInput): Promise<boolean> {
    const { repository, chartName, version } = chart;
    const { url } = await this.repositoryService.getRepository(auth, repository);
    // TODO: username password
    await this.callChartMuseum(`${url}/api/charts/${chartName}/${version}`, {
      method: 'DELETE',
    });
    return true;
  }

  async callChartMuseum(endpoint: string, options?: RequestOptions) {
    const headers: IncomingHttpHeaders = {};
    const reqUrl = endpoint;
    Logger.debug('callChartMuseum => url:', reqUrl);
    Logger.debug('callChartMuseum => options:', options);
    const defaultOptions: RequestOptions = {
      dataType: 'json',
      timeout: 10 * 1000,
      headers,
    };
    const res = await urllib.request(reqUrl, Object.assign({}, defaultOptions, options));
    if (res.status >= 400) {
      throw new HttpException(res, res.status);
    }
    return res;
  }
}
