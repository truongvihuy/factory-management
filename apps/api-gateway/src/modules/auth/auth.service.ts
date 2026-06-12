import { Injectable } from '@nestjs/common';
import { AuthClient } from 'apps/api-gateway/src/clients/auth.client';

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
