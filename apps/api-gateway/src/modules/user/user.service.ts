import { AuthClientService, HTTP_CLIENTS } from '@libs/http-client';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  constructor(
    @Inject(HTTP_CLIENTS.AUTH)
    private readonly client: AuthClientService,
  ) {}
}
