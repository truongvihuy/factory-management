import { Exceptions, PERMISSION_KEY } from '@libs/common';
import { AuthClientService, HTTP_CLIENTS } from '@libs/http-client';
import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(HTTP_CLIENTS.AUTH)
    private readonly authClient: AuthClientService,
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
