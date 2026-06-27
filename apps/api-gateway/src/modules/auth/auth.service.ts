import { AuthClient } from '@libs/clients';
import { IChangePassword, IForgotPassword, IResetPassword, RequestContext } from '@libs/common';
import { Injectable } from '@nestjs/common';

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

  getUser(userId: string, options: RequestContext) {
    return this.client.getUser(userId, options);
  }

  changePassword(data: IChangePassword, options: RequestContext) {
    return this.client.changePassword(data, options);
  }

  forgotPassword(data: IForgotPassword, options: RequestContext) {
    return this.client.forgotPassword(data, options);
  }

  resetPassword(data: IResetPassword, options: RequestContext) {
    return this.client.resetPassword(data, options);
  }

  getSessions(options: RequestContext) {
    this.client.getSessions(options);
  }

  revorked(sessionId: string, options: RequestContext) {
    return this.client.revorkedSession(sessionId, options);
  }

  revorkedAll(sessionId: string, options: RequestContext) {
    return this.client.revorkedAll(sessionId, options);
  }
}
