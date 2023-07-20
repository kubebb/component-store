import { KubernetesService } from '@/kubernetes/kubernetes.service';
import { JwtAuth } from '@/types';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class ComponentsService {
  constructor(private readonly k8sService: KubernetesService) {}

  private logger = new Logger('ComponentsService');

  async listComponents(auth: JwtAuth) {
    const k8s = await this.k8sService.getClient(auth);
    await k8s.component.list('default');
    return [];
  }
}
