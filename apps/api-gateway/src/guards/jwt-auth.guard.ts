import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

import { AuthClient } from '../clients/auth.client';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly authClient: AuthClient) {}

  async canActivate(context: ExecutionContext) {
    console.log('JwtAuthGaurd.canActivate');

    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      const user = await this.authClient.verify(token);
      request.user = user;

      return true;
    } catch {
      throw new UnauthorizedException();
    }
  }
}
