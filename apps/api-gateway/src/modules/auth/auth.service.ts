import { Injectable } from '@nestjs/common';

import { AuthClient } from '../../clients/auth.client';

@Injectable()
export class AuthService {
  constructor(private readonly client: AuthClient) {}

  // async login() {
  // }

  // register();

  // refreshToken();

  // logout();

  // validateUser();

  // hashPassword();

  // comparePassword();
}
