import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (request.user.admin) {
      return true;
    }

    throw new UnauthorizedException();
  }
}

@Injectable()
export class NotAdminGuard implements CanActivate {
  constructor() {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();

    if (!request.user.admin) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
