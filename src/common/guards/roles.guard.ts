import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { UserRole } from 'src/auth/types/user-role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<
      (typeof UserRole)[keyof typeof UserRole][]
    >(ROLES_KEY, [context.getHandler(), context.getClass()]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();

    if (!user) {
      throw new ForbiddenException('User not authenticated');
    }

    // Get user's role index
    const userRoleIndex = Object.values(UserRole).indexOf(user.role);
    // console.log(user);

    // console.log(user.role);

    // Check if the user's role satisfies any of the required roles
    const hasRole = requiredRoles.some((role) => {
      const requiredRoleIndex = Object.values(UserRole).indexOf(role);
      // Allow access if the user's role is the same or higher than the required role
      return userRoleIndex >= requiredRoleIndex;
    });

    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource',
      );
    }

    return true;
  }
}
