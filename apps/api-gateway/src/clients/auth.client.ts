import { RequestContext } from '@libs/common';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Role, User } from 'generated/prisma';
import { BaseClient } from './base.client';

@Injectable()
export class AuthClient extends BaseClient {
  constructor(config: ConfigService, httpService: HttpService) {
    super(config, httpService, 'AUTH_SERVICE_URL');
  }

  async login(token: string, options?: RequestContext) {
    return this._requestServer('post', `/auth/login`, { token }, options);
  }

  async verify(token: string, options?: RequestContext) {
    return this._requestServer('post', `/auth/verify`, { token }, options);
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
    return this._requestServer('get', `/user/admin-permission/${userId}`, null, options);
  }

  async updateAdmin(userId: string, admin: boolean, options?: RequestContext) {
    return this._requestServer('post', `/user/admin-permission/${userId}/${admin}`, null, options);
  }

  async getPemissions(userId: string, options?: RequestContext) {
    return this._requestServer('get', `/user/permission/${userId}`, null, options);
  }

  async checkPermission(userId: string, factoryId: string, role: Role, options?: RequestContext) {
    return this._requestServer('get', `/user/permission/${userId}/${factoryId}/${role}`, null, options);
  }

  async getPermission(userId: string, factoryId: string, options?: RequestContext) {
    return this._requestServer('get', `/user/permission/${userId}/${factoryId}`, null, options);
  }

  async updatePermission(userId: string, factoryId: string, role: Role, options?: RequestContext) {
    return this._requestServer('post', `/user/permission/${userId}/${factoryId}/${role}`, null, options);
  }

  async deletePermission(userId: string, factoryId: string, options?: RequestContext) {
    return this._requestServer('delete', `/user/permission/${userId}/${factoryId}`, null, options);
  }
}
