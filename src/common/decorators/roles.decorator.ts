import { SetMetadata } from '@nestjs/common';
import { UserRole } from 'src/auth/types/user-role.enum';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: (typeof UserRole)[keyof typeof UserRole][]) =>
  SetMetadata(ROLES_KEY, roles);
