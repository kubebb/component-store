import { InstallMethod } from '@/subscription/models/installmethod.enum';
import { InputType } from '@nestjs/graphql';

@InputType()
class ComponentplanImageInput {
  /** 名称（如：ghcr.io/helm/chartmuseum:v0.16.0 或 ghcr.io/helm/chartmuseum） */
  name?: string;
  /** 替换名称（如：172.22.50.223/kubebb/chartmuseum） */
  newName?: string;
  /** 替换tag（如：v0.16.0） */
  newTag?: string;
  digest?: string;
}
@InputType()
export class CreateComponentplanInput {
  /** 部署名称 */
  releaseName: string;

  /** 组件名称 */
  chartName: string;

  /** 组件仓库 */
  repository: string;

  /** 版本  */
  version: string;

  /** 更新方式 */
  componentPlanInstallMethod: InstallMethod;

  /** 自动更新时间（Cron 格式） */
  schedule?: string;

  /** 配置文件 */
  valuesYaml?: string;

  /** 替换镜像 */
  images?: ComponentplanImageInput[];
}
