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
  async checkUserRole(userId: string, factoryId: string, role: Role) {
    const userRole = await this.prisma.userRole.findUnique({
      where: { userId_factoryId: { userId, factoryId } },
    });

    if (userRole?.role === role) {
      return true;
    }

    return false;
  }

  async getUserRoles(userId: string) {
    const [user, userRoles] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: userId } }),
      this.prisma.userRole.findMany({ where: { userId } }),
    ]);

    return {
      admin: user?.admin,
      userRoles,
    };
  }

  async getRole(userId: string, factoryId: string) {
    const userRole = await this.prisma.userRole.findUnique({
      where: { userId_factoryId: { userId, factoryId } },
    });
    return userRole?.role;
  }

  async updateUserRole(userId: string, factoryId: string, role: Role) {
    const userRole = { userId, factoryId, role };
    await this.prisma.userRole.upsert({
      where: { userId_factoryId: { userId, factoryId } },
      create: userRole,
      update: userRole,
    });

    return true;
  }

  async deleteUserRole(userId: string, factoryId: string) {
    await this.prisma.userRole.delete({
      where: { userId_factoryId: { userId, factoryId } },
    });

    return true;
  }
}
