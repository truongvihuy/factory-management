import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

import { PrismaClient, Role, Status_Machine } from '../generated/prisma';

import * as factories from './data/factories.json';
import * as machines from './data/machines.json';
import * as userRoles from './data/userRoles.json';
import * as users from './data/users.json';
import * as workshops from './data/workshops.json';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await seedDBFactory();
  await seedDBWorkshop();
  await seedDBMachine();
  await seedDBUser();
  await seedDBUserRole();
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

async function seedDBUserRole() {
  await Promise.all(
    userRoles.map(async (userRole) => {
      const [user, factory] = await Promise.all([
        prisma.user.findFirstOrThrow({ where: { email: userRole.email } }),
        prisma.factory.findFirstOrThrow({ skip: userRole.factoryPos }),
      ]);

      const _userRole = {
        userId: user.id,
        factoryId: factory.id,
        role: userRole.role as Role,
      };

      return prisma.userRole.upsert({
        where: {
          userId_factoryId: {
            userId: user.id,
            factoryId: factory.id,
          },
        },
        create: _userRole,
        update: _userRole,
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

async function seedDBMachine() {
  await Promise.all(
    machines.map(async (mac) => {
      const workshop = await prisma.workshop.findFirstOrThrow({ skip: mac.workshopPos });
      return prisma.machine.create({
        data: {
          name: mac.name,
          workshopId: workshop.id,
          infoMachine: mac.infoMachine,
          installDate: mac.installDate,
          status: mac.status as Status_Machine,
        },
      });
    }),
  );
}
