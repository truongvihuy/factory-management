import { AccessScope, PrismaClient, UserStatus } from '../../src/infrastructure/database/prisma/generated/index.js';

describe('Auth Database Schema Integration', () => {
  let prisma: PrismaClient;

  beforeAll(async () => {
    prisma = new PrismaClient();

    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should connect to PostgreSQL', async () => {
    await expect(prisma.$queryRaw`SELECT 1`).resolves.toBeDefined();
  });

  it('should create a user', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'integration-user',
        email: 'integration@example.com',
        displayName: 'Integration User',
        passwordHash: 'hashed-password',
      },
    });

    expect(user.id).toBeDefined();
    expect(user.username).toBe('integration-user');
    expect(user.status).toBe(UserStatus.ACTIVE);
  });

  it('should create role and permission', async () => {
    const role = await prisma.role.create({
      data: {
        code: 'FACTORY_MANAGER',
        name: 'Factory Manager',
      },
    });

    const permission = await prisma.permission.create({
      data: {
        code: 'machine.read',
        name: 'Read Machines',
      },
    });

    expect(role.id).toBeDefined();
    expect(permission.id).toBeDefined();
  });

  it('should assign permission to role', async () => {
    const role = await prisma.role.create({
      data: {
        code: 'OPERATOR',
        name: 'Operator',
      },
    });

    const permission = await prisma.permission.create({
      data: {
        code: 'machine.read',
        name: 'Read Machines',
      },
    });

    const rolePermission = await prisma.rolePermission.create({
      data: {
        roleId: role.id,
        permissionId: permission.id,
      },
    });

    expect(rolePermission.roleId).toBe(role.id);
    expect(rolePermission.permissionId).toBe(permission.id);
  });

  it('should assign a role to a user within a factory scope', async () => {
    const user = await prisma.user.create({
      data: {
        username: 'factory-user',
        email: 'factory-user@example.com',
        displayName: 'Factory User',
        passwordHash: 'hashed-password',
      },
    });

    const role = await prisma.role.create({
      data: {
        code: 'FACTORY_MANAGER',
        name: 'Factory Manager',
      },
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
    await prisma.user.create({
      data: {
        username: 'duplicate-user',
        email: 'first@example.com',
        displayName: 'First User',
        passwordHash: 'hash',
      },
    });

    await expect(
      prisma.user.create({
        data: {
          username: 'duplicate-user',
          email: 'second@example.com',
          displayName: 'Second User',
          passwordHash: 'hash',
        },
      }),
    ).rejects.toThrow();
  });
});
