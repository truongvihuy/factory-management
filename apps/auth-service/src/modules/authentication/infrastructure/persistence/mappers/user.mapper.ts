import { UserStatus as PrismaUserStatus, User } from '@/infrastructure/database/prisma/generated';
import { UserEntity, UserStatus } from '@/modules/authentication/domain/entities/user.entity';

export class UserMapper {
  static toDomain(props: User): UserEntity {
    return UserEntity.create({
      id: props.id,
      username: props.username,
      email: props.email,
      displayName: props.displayName,
      passwordHash: props.passwordHash,
      status: this.toUserStatus(props.status),
      lockedUntil: props.lockedUntil ?? null,
      lastLoginAt: props.lastLoginAt ?? null,
    });
  }

  static toUserStatus(status: User['status']): UserEntity['status'] {
    switch (status) {
      case PrismaUserStatus.ACTIVE:
        return UserStatus.ACTIVE;
      case PrismaUserStatus.INACTIVE:
        return UserStatus.INACTIVE;
      case PrismaUserStatus.LOCKED:
        return UserStatus.LOCKED;
      default:
        throw new Error('User Status convert error');
    }
  }
}
