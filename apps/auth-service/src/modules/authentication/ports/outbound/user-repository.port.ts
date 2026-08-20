import type { UserEntity } from '../../domain/entities/user.entity';

export interface UserRepositoryPort {
  findByIdentifier(identifier: string): Promise<UserEntity | null>;

  lockUser(userId: string, lockedUntil: Date): Promise<void>;

  unlockUser(userId: string): Promise<void>;

  resetLoginSecurityState(userId: string): Promise<void>;

  updateLastLoginAt(userId: string, lastLoginAt: Date): Promise<void>;
}
