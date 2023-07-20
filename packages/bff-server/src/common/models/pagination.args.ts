import { InputType } from '@nestjs/graphql';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

@InputType({ description: '分页参数' })
export class PaginationArgs {
  /** 页码 */
  @IsOptional()
  @IsInt()
  @Min(0)
  page?: number = 1;

  /** 每页数量 */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize?: number = 20;
}
