import { ErrorCode } from '@/common/errors/error-code';
import { CanActivate, ExecutionContext, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';

import { IS_PUBLIC_KEY } from '../../../../common/security/decorators/public.decorator';
import { AccessTokenPort } from '../../application/ports/access-token.port';
import { ACCESS_TOKEN_PORT } from '../../application/ports/application.token';

@Injectable()
export class AuthenticationGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ACCESS_TOKEN_PORT)
    private readonly accessTokenService: AccessTokenPort,
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
