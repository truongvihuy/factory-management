import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthClient } from '../clients/auth.client';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly authClient: AuthClient) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization ?? '';
    const [type, token] = authorization.split(' ');

    if (type.toLowerCase() !== 'bearer') {
      throw new UnauthorizedException();
    }

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const requestId = request.requestId;
      const user = await this.authClient.verify(token, { requestId });
      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
