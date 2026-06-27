import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Exceptions } from 'libs/common';

@Injectable()
export class LocalAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization ?? '';
    const [type, token] = authorization.split(' ');

    if (type.toLowerCase() !== 'basic') {
      Exceptions.missingToken();
    }

    if (!token) {
      Exceptions.missingToken();
    }

    request['user'] = { token };

    return true;
  }
}
