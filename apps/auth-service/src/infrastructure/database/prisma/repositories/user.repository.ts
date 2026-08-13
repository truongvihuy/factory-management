import { Injectable } from '@nestjs/common';

import type { AuthenticationUser } from '@/modules/authentication/interfaces/authentication.types';
import type { UserRepository } from '@/modules/authentication/interfaces/user-repository.interface';

import { UserStatus } from '../generated';
import { PrismaService } from '../prisma.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdentifier(identifier: string): Promise<AuthenticationUser | null> {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            username: identifier,
          },
          {
            email: identifier,
          },
        ],
      },
    });

    if (!user) {
      return null;
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      status: user.status,
      failedLoginAttempts: user.failedLoginAttempts,
      lockedUntil: user.lockedUntil,
      lastLoginAt: user.lastLoginAt,
    };
  }

  async incrementFailedLoginAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        failedLoginAttempts: {
          increment: 1,
        },
      },
    });
  }

  async lockUser(userId: string, lockedUntil: Date): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.LOCKED,
        failedLoginAttempts: {
          increment: 1,
        },
        lockedUntil,
      },
    });
  }

  async resetFailedLoginAttempts(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        failedLoginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  async updateLastLoginAt(userId: string, lastLoginAt: Date): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        lastLoginAt,
      },
    });
  }
}
