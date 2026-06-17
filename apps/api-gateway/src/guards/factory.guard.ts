import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { Permission } from 'generated/prisma';
import { AuthClient } from '../clients/auth.client';

@Injectable()
export class FactoryGuard implements CanActivate {
  constructor(private readonly authClient: AuthClient) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    const factoryId: string = request.params.factoryId;
    const permissions: Permission[] = request.user.permission;
    const factoryIds = permissions.map((per: any) => per.factoryId);

    if (!factoryIds.includes(factoryId)) {
      throw new UnauthorizedException();
    }

    const userId: string = request.user.sub;
    const requestId: string = request.requestId;
    const role = await this.authClient.getPermission(userId, factoryId, { requestId, userId });

    if (!role) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
