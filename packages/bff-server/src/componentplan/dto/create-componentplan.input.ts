import { InstallMethod } from '@/subscription/models/installmethod.enum';
import { InputType } from '@nestjs/graphql';

@InputType()
export class ComponentplanImageInput {
  /** id（image没有tag的部分）如hyperledgerk8s/bc-explorer */
  id: string;
  registry?: string;
  path?: string;
  name?: string;
  tag?: string;
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
