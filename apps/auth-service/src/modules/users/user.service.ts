import { AuthHandleService } from '@libs/auth';
import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';
import { Role, User } from 'generated/prisma';

@Injectable()
export class UserService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly authHandleSerivce: AuthHandleService,
  ) {}

  async getUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }

  async getUserList() {
    return this.prisma.user.findMany({});
  }

  async createUser(userDTO: User) {
    userDTO.password = this.authHandleSerivce.hashPassword(userDTO.password);
    return this.prisma.user.create({
      data: userDTO,
    });
  }

  async updateUser(userId: string, userDTO: User) {
    userDTO.password = this.authHandleSerivce.hashPassword(userDTO.password);
    return this.prisma.user.update({
      where: { id: userId },
      data: userDTO,
    });
  }

  /** Handle Admin */
  async checkAdmin(userId: string) {
    const user = await this.prisma.user.findFirstOrThrow({
      where: { id: userId },
    });
    return user.admin;
  }

  async updateAdmin(userId: string, admin: boolean) {
    await this.prisma.user.update({
      where: { id: userId },
      data: { admin },
    });
    return true;
  }

  /** Handle Permission */
  async getPermissions(userId: string) {
    return this.prisma.permission.findMany({ where: { userId } });
  }

  async getPermission(userId: string, factoryId: string) {
    const permission = await this.prisma.permission.findUniqueOrThrow({
      where: { userId_factoryId: { userId, factoryId } },
    });

    return permission.role;
  }

  async checkPermission(userId: string, factoryId: string, role: Role) {
    const permission = await this.prisma.permission.findUniqueOrThrow({
      where: { userId_factoryId: { userId, factoryId } },
    });

    if (permission?.role === role) {
      return true;
    }

    return false;
  }

  async updatePermission(userId: string, factoryId: string, role: Role) {
    const _permission = { userId, factoryId, role };
    await this.prisma.permission.upsert({
      where: { userId_factoryId: { userId, factoryId } },
      create: _permission,
      update: _permission,
    });

    return true;
  }

  async delelePermission(userId: string, factoryId: string) {
    await this.prisma.permission.delete({
      where: { userId_factoryId: { userId, factoryId } },
    });

    return true;
  }
}
