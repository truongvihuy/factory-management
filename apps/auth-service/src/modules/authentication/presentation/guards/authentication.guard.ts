import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { ErrorCode } from '@/common/errors/error-code';
import { IS_PUBLIC_KEY } from '@/common/security/decorators/public.decorator';

import { AccessTokenServicePort } from '../../ports/outbound';
import { ACCESS_TOKEN_SERVICE_PORT } from '../../ports/token';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ACCESS_TOKEN_SERVICE_PORT)
    private readonly accessTokenService: AccessTokenServicePort,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const authorization = request.headers['authorization'];

    if (!authorization) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_MISSING_ACCESS_TOKEN,
        message: 'Access token is required',
      });
    }

    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_ACCESS_TOKEN,
        message: 'Invalid or expired access token',
      });
    }

    try {
      request.user = await this.accessTokenService.verify(token);

      return true;
    } catch {
      throw new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_ACCESS_TOKEN,
        message: 'Invalid or expired access token',
      });
    }
  }
}
