import type { AuthenticationUser } from './authentication.types';

export interface UserRepository {
  findByIdentifier(identifier: string): Promise<AuthenticationUser | null>;

  incrementFailedLoginAttempts(userId: string): Promise<void>;

  lockUser(userId: string, lockedUntil: Date): Promise<void>;

  resetFailedLoginAttempts(userId: string): Promise<void>;

  updateLastLoginAt(userId: string, lastLoginAt: Date): Promise<void>;
}
