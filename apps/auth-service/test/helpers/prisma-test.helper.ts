import type { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';

export const unique = (prefix: string): string => `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

export const createTestUser = async (
  prisma: PrismaService,
  overrides: Partial<{
    username: string;
    email: string;
    displayName: string;
    passwordHash: string;
  }> = {},
) => {
  const username = overrides.username ?? unique('user');

  return prisma.user.create({
    data: {
      username,
      email: overrides.email ?? `${username}@example.com`,
      displayName: overrides.displayName ?? 'Test User',
      passwordHash: overrides.passwordHash ?? 'hashed-password',
    },
  });
};

export const createTestRole = async (
  prisma: PrismaService,
  overrides: Partial<{
    code: string;
    name: string;
  }> = {},
) => {
  const code = overrides.code ?? unique('ROLE');

  return prisma.role.create({
    data: {
      code,
      name: overrides.name ?? 'Test Role',
    },
  });
};

export const createTestPermission = async (
  prisma: PrismaService,
  overrides: Partial<{
    code: string;
    name: string;
  }> = {},
) => {
  const code = overrides.code ?? unique('permission');

  return prisma.permission.create({
    data: {
      code,
      name: overrides.name ?? 'Test Permission',
    },
  });
};

export const createTestRolePermission = async (
  prisma: PrismaService,
  overrides: {
    roleId: string;
    permissionId: string;
  },
) => {
  return prisma.rolePermission.create({
    data: {
      roleId: overrides.roleId,
      permissionId: overrides.permissionId,
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

export const deleteTestRole = async (prisma: PrismaService, roleId: string): Promise<void> => {
  await prisma.role.delete({
    where: {
      id: roleId,
    },
  });
};

export const deleteTestPermission = async (prisma: PrismaService, permissionId: string): Promise<void> => {
  await prisma.permission.delete({
    where: {
      id: permissionId,
    },
  });
};

export const deleteTestRolePermission = async (prisma: PrismaService, rolePermissionId: string): Promise<void> => {
  await prisma.rolePermission.delete({
    where: {
      id: rolePermissionId,
    },
  });
};
