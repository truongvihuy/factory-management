/* eslint-disable no-console */
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/infrastructure/database/prisma/generated';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
  adapter,
});

prisma.$on('query', (e) => {
  console.log('Query: ' + e.query);
  console.log('Params: ' + e.params);
  console.log('Duration: ' + e.duration + 'ms');
});

const roles = [
  {
    code: 'FACTORY_MANAGER',
    name: 'Factory Manager',
  },
  {
    code: 'PRODUCTION_SUPERVISOR',
    name: 'Production Supervisor',
  },
  {
    code: 'MAINTENANCE_ENGINEER',
    name: 'Maintenance Engineer',
  },
  {
    code: 'OPERATOR',
    name: 'Operator',
  },
];

const permissions = [
  {
    code: 'machine.read',
    name: 'Read Machines',
  },
  {
    code: 'machine.write',
    name: 'Manage Machines',
  },
  {
    code: 'maintenance.read',
    name: 'Read Maintenance',
  },
  {
    code: 'maintenance.write',
    name: 'Manage Maintenance',
  },
  {
    code: 'incident.read',
    name: 'Read Incidents',
  },
  {
    code: 'incident.write',
    name: 'Manage Incidents',
  },
];

const rolePermissions: Record<string, string[]> = {
  FACTORY_MANAGER: [
    'machine.read',
    'machine.write',
    'maintenance.read',
    'maintenance.write',
    'incident.read',
    'incident.write',
  ],

  PRODUCTION_SUPERVISOR: ['machine.read', 'maintenance.read', 'incident.read'],

  MAINTENANCE_ENGINEER: ['machine.read', 'maintenance.read', 'maintenance.write', 'incident.read', 'incident.write'],

  OPERATOR: ['machine.read', 'maintenance.read', 'incident.read'],
};

async function main() {
  console.log('Seeding reference data...');

  // 1. Roles
  for (const role of roles) {
    await prisma.role.upsert({
      where: {
        code: role.code,
      },
      update: {
        name: role.name,
      },
      create: role,
    });
  }
  console.log('- Seeding roles success.');

  // 2. Permissions
  for (const permission of permissions) {
    await prisma.permission.upsert({
      where: {
        code: permission.code,
      },
      update: {
        name: permission.name,
      },
      create: permission,
    });
  }
  console.log('- Seeding permission success.');

  // 3. Role permissions
  for (const [roleCode, permissionCodes] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({
      where: {
        code: roleCode,
      },
    });

    for (const permissionCode of permissionCodes) {
      const permission = await prisma.permission.findUniqueOrThrow({
        where: {
          code: permissionCode,
        },
      });

      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }
  console.log('- Seeding role permission success.');

  console.log('Reference data seeded successfully.');
}

main()
  .catch((error) => {
    console.error('Failed to seed reference data:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
