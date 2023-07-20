import { Directive, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class DefaultModel {
  /**
   * 完整名称（displayName + name）
   *
   * 以租户为例，租户 displayName 为 song，name 为 tenant-yjhg5，则 fullName 为 song (tenant-yjhg5)，
   * 如果没有指定 displayName，则 fullName 跟 name 一样
   */
  @Directive('@fullName')
  fullName?: string;
}
