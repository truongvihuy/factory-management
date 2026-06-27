import { Injectable } from '@nestjs/common';
import { Role, User } from 'generated/prisma';
import { AuthHandleService } from 'libs/auth';
import { PrismaService } from 'libs/database';

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

  /** Handle User Role */
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
