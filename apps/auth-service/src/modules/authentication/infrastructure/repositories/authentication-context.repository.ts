import { Injectable } from '@nestjs/common';

import { UserStatus } from '@/infrastructure/database/prisma/generated';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

import { AuthenticationUser, AuthenticationUserStatus } from '../../domain/entities/authentication-user.entity';
import type { AuthenticationContextRepositoryPort } from '../../domain/ports/authentication-context.port';

@Injectable()
export class PrismaAuthenticationContextRepository implements AuthenticationContextRepositoryPort {
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

    return AuthenticationUser.create({
      id: user.id,
      username: user.username,
      email: user.email,
      displayName: user.displayName,
      passwordHash: user.passwordHash,
      status: user.status as AuthenticationUserStatus,
      lockedUntil: user.lockedUntil,
      lastLoginAt: user.lastLoginAt,
    });
  }

  async lockUser(userId: string, lockedUntil: Date): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.LOCKED,
        lockedUntil,
      },
    });
  }

  async unlockUser(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.ACTIVE,
        lockedUntil: null,
      },
    });
  }

  async resetLoginSecurityState(userId: string): Promise<void> {
    await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status: UserStatus.ACTIVE,
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
