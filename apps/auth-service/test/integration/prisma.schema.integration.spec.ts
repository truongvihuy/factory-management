import { Test, type TestingModule } from '@nestjs/testing';

import { AppConfigModule } from '../../src/common/config/config.module';
import { AccessScope, UserStatus } from '../../src/infrastructure/database/prisma/generated';
import { PrismaModule } from '../../src/infrastructure/database/prisma/prisma.module';
import { PrismaService } from '../../src/infrastructure/database/prisma/prisma.service';
import {
  createTestPermission,
  createTestRole,
  createTestRolePermission,
  createTestUser,
  deleteTestPermission,
  deleteTestRole,
  deleteTestRolePermission,
  deleteTestUser,
  unique,
} from '../helpers/prisma-test.helper';

describe('Auth Database Schema Integration', () => {
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppConfigModule, PrismaModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await module.close();
  });

  it('should connect to PostgreSQL', async () => {
    await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();
  });

  it('should create a user', async () => {
    const username = unique('integration-user');
    const user = await createTestUser(prisma, {
      username,
      displayName: 'Integration User',
      passwordHash: 'hashed-password',
    });

    expect(user.id).toBeDefined();
    expect(user.username).toBe(username);
    expect(user.status).toBe(UserStatus.ACTIVE);

    await deleteTestUser(prisma, user.id);
  });

  it('should create role and permission', async () => {
    const role = await createTestRole(prisma, {
      code: unique('FACTORY_MANAGER'),
      name: 'Factory Manager',
    });

    const permission = await createTestPermission(prisma, {
      code: unique('machine.read'),
      name: 'Read Machines',
    });

    expect(role.id).toBeDefined();
    expect(permission.id).toBeDefined();

    await deleteTestPermission(prisma, permission.id);
    await deleteTestRole(prisma, role.id);
  });

  it('should assign permission to role', async () => {
    const role = await createTestRole(prisma, {
      code: unique('OPERATOR'),
      name: 'Operator',
    });

    const permission = await createTestPermission(prisma, {
      code: unique('machine.read'),
      name: 'Read Machines',
    });

    const rolePermission = await createTestRolePermission(prisma, {
      roleId: role.id,
      permissionId: permission.id,
    });

    expect(rolePermission.roleId).toBe(role.id);
    expect(rolePermission.permissionId).toBe(permission.id);

    await deleteTestRolePermission(prisma, rolePermission.id);
    await deleteTestPermission(prisma, permission.id);
    await deleteTestRole(prisma, role.id);
  });

  it('should assign a role to a user within a factory scope', async () => {
    const user = await createTestUser(prisma, {
      username: unique('factory-user'),
      displayName: 'Factory User',
    });

    const role = await createTestRole(prisma, {
      code: unique('FACTORY_MANAGER'),
      name: 'Factory Manager',
    });

    const assignment = await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
        scope: AccessScope.FACTORY,
        factoryId: '00000000-0000-0000-0000-000000000001',
      },
    });

    expect(assignment.scope).toBe(AccessScope.FACTORY);
    expect(assignment.factoryId).toBe('00000000-0000-0000-0000-000000000001');

    await prisma.userRole.delete({
      where: {
        id: assignment.id,
      },
    });

    await deleteTestRole(prisma, role.id);
    await deleteTestUser(prisma, user.id);
  });

  // it('should grant user access to a factory', async () => {
  //   const user = await prisma.user.create({
  //     data: {
  //       username: 'access-user',
  //       email: 'access-user@example.com',
  //       displayName: 'Access User',
  //       passwordHash: 'hashed-password',
  //     },
  //   });

  //   const factoryId = '00000000-0000-0000-0000-000000000002';

  //   const access = await prisma.userFactoryAccess.create({
  //     data: {
  //       userId: user.id,
  //       factoryId,
  //     },
  //   });

  //   expect(access.userId).toBe(user.id);
  //   expect(access.factoryId).toBe(factoryId);
  //   expect(access.revokedAt).toBeNull();
  // });

  // it('should load user roles and factory accesses', async () => {
  //   const user = await prisma.user.create({
  //     data: {
  //       username: 'relation-user',
  //       email: 'relation-user@example.com',
  //       displayName: 'Relation User',
  //       passwordHash: 'hashed-password',
  //     },
  //   });

  //   const role = await prisma.role.create({
  //     data: {
  //       code: 'SUPERVISOR',
  //       name: 'Supervisor',
  //     },
  //   });

  //   await prisma.userRole.create({
  //     data: {
  //       userId: user.id,
  //       roleId: role.id,
  //       scope: 'FACTORY',
  //       factoryId: '00000000-0000-0000-0000-000000000003',
  //     },
  //   });

  //   await prisma.userFactoryAccess.create({
  //     data: {
  //       userId: user.id,
  //       factoryId: '00000000-0000-0000-0000-000000000003',
  //     },
  //   });

  //   const result = await prisma.user.findUnique({
  //     where: { id: user.id },
  //     include: {
  //       userRoles: { include: { role: true } },
  //       factoryAccesses: true,
  //     },
  //   });

  //   expect(result).not.toBeNull();
  //   expect(result?.userRoles).toHaveLength(1);
  //   expect(result?.userRoles[0]?.role.code).toBe('SUPERVISOR');
  //   expect(result?.factoryAccesses).toHaveLength(1);
  // });

  it('should reject duplicate username', async () => {
    const username = unique('duplicate-user');

    const user = await createTestUser(prisma, {
      username,
      displayName: 'First User',
    });

    await expect(
      createTestUser(prisma, {
        username,
        email: `${username}-second@example.com`,
        displayName: 'Second User',
      }),
    ).rejects.toThrow();

    await deleteTestUser(prisma, user.id);
  });

  it('should cascade delete user roles when user is deleted', async () => {
    const user = await createTestUser(prisma, {
      username: unique('cascade-user'),
      displayName: 'Cascade User',
    });

    const role = await createTestRole(prisma, {
      code: unique('CASCADE_ROLE'),
      name: 'Cascade Role',
    });

    await prisma.userRole.create({
      data: {
        userId: user.id,
        roleId: role.id,
        scope: AccessScope.FACTORY,
        factoryId: '00000000-0000-0000-0000-000000000004',
      },
    });

    await deleteTestUser(prisma, user.id);

    const assignments = await prisma.userRole.findMany({
      where: { userId: user.id },
    });

    expect(assignments).toHaveLength(0);

    await deleteTestRole(prisma, role.id);
  });
});
