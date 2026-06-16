import { Options } from '@libs/common';
import { Injectable } from '@nestjs/common';

import { AuthClient } from '../../clients/auth.client';

@Injectable()
export class AuthService {
  constructor(private readonly client: AuthClient) {}

  async login(token: string, options: Options) {
    return this.client.login(token, options);
  }

  async verify(token: string, options: Options) {
    return this.client.verify(token, options);
  }

  async getUser(userId: string, options: Options) {
    return this.client.getUser(userId, options);
  }

  // register();

  // refreshToken();

  // logout();

  // validateUser();

  // hashPassword();

  // comparePassword();
}
