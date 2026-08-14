import { UserStatus } from '../../src/infrastructure/database/prisma/generated';
import type { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import { LoginAttemptStore } from '../../src/modules/authentication/interfaces/login-attempt-store.interface';

export const unique = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createTestUser = async (
  prisma: PrismaService,
  passwordHasher: {
    hash(password: string): Promise<string>;
  },
  overrides: {
    username?: string;
    email?: string;
    displayName?: string;
    status?: UserStatus;
    password?: string;
    lockedUntil?: Date | null;
    lastLoginAt?: Date | null;
  } = {},
) => {
  const username = overrides.username ?? unique('integration-user');
  const password = overrides.password ?? 'password123';

  const passwordHash = await passwordHasher.hash(password);

  return prisma.user.create({
    data: {
      username,
      email: overrides.email ?? `${username}@example.com`,
      displayName: overrides.displayName ?? 'Integration User',
      passwordHash,
      status: overrides.status ?? UserStatus.ACTIVE,
      lockedUntil: overrides.lockedUntil ?? null,
      lastLoginAt: overrides.lastLoginAt ?? null,
    },
  });
};

export const findTestUser = async (prisma: PrismaService, userId: string) => {
  return prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
};

export const deleteTestUser = async (prisma: PrismaService, userId: string): Promise<void> => {
  await prisma.user.delete({
    where: {
      id: userId,
    },
  });
};

/**
 * Removes all authentication state created by the test.
 *
 * PostgreSQL:
 * - user
 *
 * Redis:
 * - failed login attempts
 */
export const cleanupUser = async (
  loginAttemptStore: LoginAttemptStore,
  prisma: PrismaService,
  userId: string,
): Promise<void> => {
  await loginAttemptStore.resetAttempts(userId);

  await deleteTestUser(prisma, userId);
};
