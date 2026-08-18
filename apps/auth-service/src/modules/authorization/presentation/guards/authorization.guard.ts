import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ErrorCode } from '@/common/errors/error-code';

import { AUTHORIZATION_CONTEXT_PORT } from '../../application/ports/application.token';
import type { AuthorizationContextPort } from '../../application/ports/authorization-context.port';
import { AuthorizationDeniedError } from '../../domain/errors/authorization-denied.error';
import { AuthorizationRule } from '../../domain/rules/authorization.rule';
import { REQUIRED_PERMISSION_KEY } from '../decorators/require-permission.decorator';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(AUTHORIZATION_CONTEXT_PORT)
    private readonly authorizationContextPort: AuthorizationContextPort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(REQUIRED_PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredPermission) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    const user = request.user;

    if (!user?.userId) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_ACCESS_TOKEN,
        message: 'Invalid or expired access token',
      });
    }

    const authorizationContext = await this.authorizationContextPort.getByUserId(user.userId);

    const factoryId = this.resolveFactoryId(request);

    try {
      AuthorizationRule.ensureCanAccess(authorizationContext, {
        permission: requiredPermission,
        factoryId,
      });

      return true;
    } catch (error) {
      if (error instanceof AuthorizationDeniedError) {
        throw new ForbiddenException({
          code: ErrorCode.AUTH_PERMISSION_DENIED,
          message: error.message,
        });
      }

      throw error;
    }
  }

  private resolveFactoryId(request: Request): string | null {
    const routeFactoryId = request.params?.factoryId;

    if (typeof routeFactoryId === 'string' && routeFactoryId.length > 0) {
      return routeFactoryId;
    }

    const headerFactoryId = request.headers['x-factory-id'];

    if (typeof headerFactoryId === 'string' && headerFactoryId.length > 0) {
      return headerFactoryId;
    }

    return null;
  }
}
