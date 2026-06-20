import { IChangePassword, IForgotPassword, IResetPassword, RequestContext } from '@libs/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, User } from 'generated/prisma';
import { BaseClient } from './base.client';

@Injectable()
export class AuthClient extends BaseClient {
  constructor(configService: ConfigService, httpService: HttpService) {
    super(configService, httpService, 'AUTH_SERVICE_URL');
  }

  async login(infoLogin: { basicToken: string; ip: string; userAgent: string | null }, options?: RequestContext) {
    return this._requestServer('post', `/auth/login`, infoLogin, options);
  }

  async refreshToken(refreshToken: string, options?: RequestContext) {
    return this._requestServer('post', `/auth/refresh-token`, { token: refreshToken }, options);
  }

  async logout(sessionId: string, options?: RequestContext) {
    return this._requestServer('post', '/auth/logout', { sessionId }, options);
  }

  async verify(token: string, options?: RequestContext) {
    return this._requestServer('post', `/auth/verify`, { token }, options);
  }

  async changePassword(data: IChangePassword, options?: RequestContext) {
    return this._requestServer('post', `/auth/change-password`, data, options);
  }

  async forgotPassword(data: IForgotPassword, options?: RequestContext) {
    return this._requestServer('post', `/auth/forgot-password`, data, options);
  }

  async resetPassword(data: IResetPassword, options?: RequestContext) {
    return this._requestServer('post', `/auth/reset-password`, data, options);
  }

  async getSessions(options: RequestContext) {
    return this._requestServer('get', `/auth/session`, null, options);
  }

  async revorkedAll(sessionId: string, options: RequestContext) {
    return this._requestServer('post', `/auth/session/revorked/all/${sessionId}`, null, options);
  }

  async revorkedSession(sessionId: string, options: RequestContext) {
    return this._requestServer('post', `/auth/session/revorked/${sessionId}`, null, options);
  }

  async getUser(userId: string, options?: RequestContext) {
    return this._requestServer('get', `/user/${userId}`, null, options);
  }

  async createUser(user: User, options?: RequestContext) {
    return this._requestServer('post', `/user`, user, options);
  }

  async updateUser(userId: string, user: User, options?: RequestContext) {
    return this._requestServer('put', `/user/${userId}`, user, options);
  }

  async checkAdmin(userId: string, options?: RequestContext) {
    return this._requestServer('get', `/user/role/admin/${userId}`, null, options);
  }

  async updateAdmin(userId: string, flagAdmin: boolean, options?: RequestContext) {
    return this._requestServer('put', `/user/role/admin/${userId}/${flagAdmin}`, null, options);
  }

  async getUserRoles(userId: string, options?: RequestContext) {
    return this._requestServer('get', `/user/role/${userId}`, null, options);
  }

  async checkUserRole(userId: string, factoryId: string, role: Role, options?: RequestContext) {
    return this._requestServer('get', `/user/role/${userId}/${factoryId}/${role}`, null, options);
  }

  async getRole(userId: string, factoryId: string, options?: RequestContext) {
    return this._requestServer('get', `/user/role/${userId}/${factoryId}`, null, options);
  }

  async updateUserRole(userId: string, factoryId: string, role: Role, options?: RequestContext) {
    return this._requestServer('post', `/user/role/update/${userId}/${factoryId}/${role}`, null, options);
  }

  async deleteUserRole(userId: string, factoryId: string, options?: RequestContext) {
    return this._requestServer('delete', `/user/role/delete/${userId}/${factoryId}`, null, options);
  }
}
