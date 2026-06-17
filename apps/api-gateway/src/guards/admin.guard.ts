import { IS_ADMIN_KEY } from '@libs/common';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const isAdmin = this.reflector.get<boolean>(IS_ADMIN_KEY, context.getHandler()) ?? true;

    const user = request.user;
    if (isAdmin !== user.admin) {
      throw new UnauthorizedException();
    }

    return true;
  }
}
