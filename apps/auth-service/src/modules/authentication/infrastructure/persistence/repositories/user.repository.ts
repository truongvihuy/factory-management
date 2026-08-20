import { Injectable } from '@nestjs/common';

import { UserStatus } from '@/infrastructure/database/prisma/generated';
import { PrismaService } from '@/infrastructure/database/prisma/prisma.service';

import { UserEntity } from '../../../domain/entities/user.entity';
import { UserRepositoryPort } from '../../../ports/outbound';
import { UserMapper } from '../mappers/user.mapper';

@Injectable()
export class PrismaUserRepository implements UserRepositoryPort {
  constructor(private readonly prisma: PrismaService) {}

  async findByIdentifier(identifier: string): Promise<UserEntity | null> {
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

    return UserMapper.toDomain(user);
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
