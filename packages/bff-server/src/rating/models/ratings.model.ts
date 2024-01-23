import { Prompt } from '@/prompt/models/prompt.model';
import { RatingStatus, RatingTaskStatus } from '@/rating/models/rating.status.enum';
import { Field, HideField, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RatingTaskField {
  @Field(() => String, { description: '结束时间' })
  lastTransitionTime?: string;
  message?: string;
  reason?: string;
  @Field(() => RatingTaskStatus, { description: '任务状态' })
  status?: string;
  type?: string;
  @Field(() => String, { description: '任务名称' })
  taskRunName?: string;
  [k: string]: any;
}

@ObjectType()
class RatingTaskMapField {
  reliability?: RatingTaskField[];
  security?: RatingTaskField[];
  [k: string]: RatingTaskField[];
}

@ObjectType()
export class Rating {
  /** 名称 */
  @Field(() => ID, { description: 'rating名称' })
  name?: string;
  /** 组件名称 */
  @Field(() => String, { description: '组件名称' })
  componentName: string;
  /** namespace */
  namespace: string;
  /** 版本 */
  @Field(() => String, { description: '版本' })
  version?: string;
  /** 仓库名称 */
  @Field(() => String, { description: '仓库名称' })
  repository: string;
  /** 评测时间 */
  @Field(() => String, { description: '最近评测时间' })
  creationTimestamp: string;
  /** promptNames */
  @HideField()
  promptNames?: string[];
  /** 评测状态 */
  @Field(() => RatingStatus, { description: '评测状态' })
  status?: string;
  /** prompts */
  prompts?: Prompt[];
  /** RBAC */
  @Field(() => String, { description: 'RBAC权限图' })
  rbac?: string;
  /** tasks **/
  tasks?: RatingTaskMapField;
}
