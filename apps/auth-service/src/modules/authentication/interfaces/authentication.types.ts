import { UserStatus } from '@/infrastructure/database/prisma/generated';

export type AuthenticationIdentifier = string;

export interface AuthenticationUser {
  id: string;
  username: string;
  email: string;
  displayName: string;

  passwordHash: string;

  status: UserStatus;

  failedLoginAttempts: number;
  lockedUntil: Date | null;
  lastLoginAt: Date | null;
}

export interface LoginCommand {
  identifier: AuthenticationIdentifier;
  password: string;
}

export interface AuthenticationResult {
  accessToken: string;

  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
  };
}
