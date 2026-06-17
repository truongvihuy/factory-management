import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

import { PrismaClient, Role } from '../generated/prisma';

import * as factories from './data/factories.json';
import * as permissions from './data/permission.json';
import * as users from './data/users.json';
import * as workshops from './data/workshops.json';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  // await seedDBFactory();
  // await seedDBWorkshop();
  await seedDBUser();
  await seedDBPermission();
}
main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });

async function seedDBUser() {
  await Promise.all(
    users.map((user) =>
      prisma.user.upsert({
        where: { email: user.email },
        create: {
          name: user.name,
          email: user.email,
          password: bcrypt.hashSync(user.password, 10),
          status: user.status,
          admin: user.admin,
        },
        update: {
          name: user.name,
          email: user.email,
          password: bcrypt.hashSync(user.password, 10),
          status: user.status,
          admin: user.admin,
        },
      }),
    ),
  );
}

async function seedDBPermission() {
  await Promise.all(
    permissions.map(async (permission) => {
      const [user, factory] = await Promise.all([
        prisma.user.findFirstOrThrow({ where: { email: permission.email } }),
        prisma.factory.findFirstOrThrow({ skip: permission.factoryPos }),
      ]);

      const _permission = {
        userId: user.id,
        factoryId: factory.id,
        role: permission.role as Role,
      };

      return prisma.permission.upsert({
        where: {
          userId_factoryId: {
            userId: user.id,
            factoryId: factory.id,
          },
        },
        create: _permission,
        update: _permission,
      });
    }),
  );
}

async function seedDBFactory() {
  await Promise.all(factories.map((fac) => prisma.factory.create({ data: fac })));
}

async function seedDBWorkshop() {
  await Promise.all(
    workshops.map(async (wor) => {
      const factory = await prisma.factory.findFirstOrThrow({ skip: wor.factoryPos });
      return prisma.workshop.create({
        data: {
          name: wor.name,
          factoryId: factory.id,
        },
      });
    }),
  );
}
