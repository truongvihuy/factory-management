import { RequestContext } from '@libs/common';
import { Injectable } from '@nestjs/common';

import { AuthClient } from '../../clients/auth.client';

@Injectable()
export class AuthService {
  constructor(private readonly client: AuthClient) {}

  login(payload: { basicToken: string; ip: string; userAgent: string | null }, options: RequestContext) {
    return this.client.login(payload, options);
  }

  refreshToken(refreshToken: string, options: RequestContext) {
    return this.client.refreshToken(refreshToken, options);
  }

  logout(sessionId: string, options: RequestContext) {
    return this.client.logout(sessionId, options);
  }

  verify(token: string, options: RequestContext) {
    return this.client.verify(token, options);
  }

  async getUser(userId: string, options: RequestContext) {
    return this.client.getUser(userId, options);
  }
}
