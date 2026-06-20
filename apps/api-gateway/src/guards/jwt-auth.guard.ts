import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { IS_PUBLIC_KEY } from '@libs/common';
import { Reflector } from '@nestjs/core';
import { AuthClient } from '../clients/auth.client';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authClient: AuthClient,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride(IS_PUBLIC_KEY, [context.getHandler(), context.getClass()]);

    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization ?? '';
    const [type, token] = authorization.split(' ');

    if (type.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException();
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    const requestId = request.requestId;
    const user = await this.authClient.verify(token, { requestId });
    request.user = user;

    return true;
  }
}
