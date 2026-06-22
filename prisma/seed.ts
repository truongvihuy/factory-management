import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaClient, Role, Status_Sensor } from '../generated/prisma';

const Metrics = [
  'temperature',
  'humidity',
  'pressure',
  'voltage',
  'current',
  'power',
  'energy',
  'speed',
  'vibration',
  'flow_rate',
];

const Units = ['*C', '%', 'bar', 'V', 'A', 'kW', 'kWh', 'rpm', 'mm/s', 'm3/h'];

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await initDb();
  await seedDBFactory();
  await seedDBUser();
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

async function initDb() {
  await prisma.refreshToken.deleteMany();
  await prisma.session.deleteMany();
  await prisma.userRole.deleteMany();
  await prisma.user.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.factory.deleteMany();
}

async function seedDBUser() {
  const admin = {
    name: 'admin',
    email: 'admin@abc.co',
    password: bcrypt.hashSync('123456', 10),
    status: true,
    admin: true,
  };
  await prisma.user.upsert({
    where: { email: admin.email },
    create: admin,
    update: admin,
  });

  const factories = await prisma.factory.findMany();

  for (let [_i, role] of Object.values(Role).entries()) {
    for (let [index, fac] of factories.entries()) {
      let user = {
        name: `${role.toLowerCase()} ${index}`,
        email: `${role.toLowerCase()}${index}@abc.co`,
        password: admin.password,
        status: true,
        admin: false,
      };
      let user_ = await prisma.user.upsert({
        where: { email: user.email },
        create: user,
        update: user,
      });
      let userRole = {
        factoryId: fac.id,
        userId: user_.id,
        role: role as Role,
      };
      await prisma.userRole.upsert({
        where: {
          userId_factoryId: {
            userId: user_.id,
            factoryId: fac.id,
          },
        },
        create: userRole,
        update: userRole,
      });
    }
  }
}

async function seedDBFactory() {
  for (let a = 0; a < 10; a++) {
    const fac = await prisma.factory.create({
      data: {
        name: `Factory ${a + 1}`,
        address: `123 Abc, HCMC, VN`,
      },
    });

    for (let b = 0; b < 2; b++) {
      const wor = await prisma.workshop.create({
        data: {
          name: `Workshop ${a + 1}_${b + 1}`,
          factoryId: fac.id,
        },
      });

      for (let c = 0; c < 50; c++) {
        const mac = await prisma.machine.create({
          data: {
            name: `Machine ${a + 1}_${b + 1}_${c + 1}`,
            workshopId: wor.id,
            infoMachine: `Thiss is description Machine ${a + 1}_${b + 1}_${c + 1}`,
            status: 'RUNNING',
            installDate: new Date(),
          },
        });

        for (let d = 0; d < 10; d++) {
          const sen = await prisma.sensor.create({
            data: {
              name: `Sensor ${a + 1}_${b + 1}_${c + 1}_${Metrics[d]}${d + 1}`,
              machineId: mac.id,
              metric: Metrics[d],
              unit: Units[d],
              status: Status_Sensor.ACTIVE,
            },
          });
        }
      }
    }
  }
}
