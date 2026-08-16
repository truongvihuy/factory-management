import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { AUTHORIZATION_CONTEXT } from '@/common/constants/authentication.constants';
import type { AuthorizationContextPort } from '../../application/ports/authorization-context.port';
import { AuthorizationRule } from '../../domain/rules/authorization.rule';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';
@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTHORIZATION_CONTEXT)
    private readonly authorizationContextPort: AuthorizationContextPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.get<string>(REQUIRED_PERMISSION_KEY, context.getHandler());

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const user = request.user;

    if (!user?.userId) {
      throw new ForbiddenException();
    }

    const authorizationContext = await this.authorizationContextPort.getByUserId(user.userId);

    const factoryId = request.params?.factoryId ?? request.headers['x-factory-id'] ?? null;

    AuthorizationRule.ensureCanAccess(authorizationContext, {
      permission: requiredPermission,
      factoryId,
    });

    return true;
  }
}
