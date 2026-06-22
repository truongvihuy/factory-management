import { Exceptions, PERMISSION_KEY } from '@libs/common';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthClient } from '../clients/auth.client';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authClient: AuthClient,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const permission = this.reflector.getAllAndOverride(PERMISSION_KEY, [context.getHandler(), context.getClass()]);

    if (!permission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const userId = request.user.sub;
    const factoryId: string = request.params.factoryId;
    const requestId: string = request.requestId;

    const hasPermission = this.authClient.checkUserRole(userId, factoryId, permission, { userId, requestId });

    if (!hasPermission) {
      Exceptions.accessDenied();
    }

    return true;
  }
}
