import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators';
import { EAdminStatus, Role } from '../enums';

@Injectable()
export class AdminRolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    if (user.isRoot) return true;

    const operations = user.role?.status === EAdminStatus.Active ? user.role.operations : [];
    const userRoles = operations.map((operation) => operation.name);

    return requiredRoles.some((role) => userRoles.includes(role));
  }
}
