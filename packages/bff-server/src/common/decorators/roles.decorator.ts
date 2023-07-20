import { SetMetadata } from '@nestjs/common';
import { UserRole } from '../models/user-role.enum';

/**
 * 控制哪些角色可以访问
 * @param roles 角色
 */
export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

export { UserRole };
