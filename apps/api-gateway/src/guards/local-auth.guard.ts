import { Exceptions } from '@libs/common';
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization ?? '';
    const [type, token] = authorization.split(' ');

    if (type.toLowerCase() !== 'basic') {
      throw new UnauthorizedException();
    }

    if (!token) {
      Exceptions.invalidCredetials();
    }

    request['user'] = { token };

    return true;
  }
}
