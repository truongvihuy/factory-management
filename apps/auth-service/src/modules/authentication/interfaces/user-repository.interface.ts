import type { AuthenticationUser } from './authentication.types';

export interface UserRepository {
  findByIdentifier(identifier: string): Promise<AuthenticationUser | null>;

  lockUser(userId: string, lockedUntil: Date): Promise<void>;

  unlockUser(userId: string): Promise<void>;

  resetLoginSecurityState(userId: string): Promise<void>;

  updateLastLoginAt(userId: string, lastLoginAt: Date): Promise<void>;
}
