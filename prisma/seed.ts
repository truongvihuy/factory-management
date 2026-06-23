import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';
import { PrismaClient, Role, Status_Device, Status_Machine, Status_Sensor } from '../generated/prisma';

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
  await prisma.device.deleteMany();
  await prisma.sensor.deleteMany();
  await prisma.machine.deleteMany();
  await prisma.workshop.deleteMany();
  await prisma.factory.deleteMany();
}

async function seedDBUser() {
  const admin_ = {
    name: 'admin',
    email: 'admin@abc.co',
    password: bcrypt.hashSync('123456', 10),
    status: true,
    admin: true,
  };
  await prisma.user.upsert({
    where: { email: admin_.email },
    create: admin_,
    update: admin_,
  });

  const factories = await prisma.factory.findMany();

  for (let [_i, role] of Object.values(Role).entries()) {
    for (let [index, fac] of factories.entries()) {
      const user_ = {
        name: `${role.toLowerCase()} ${index}`,
        email: `${role.toLowerCase()}${index}@abc.co`,
        password: admin_.password,
        status: true,
        admin: false,
      };
      let user = await prisma.user.upsert({
        where: { email: user_.email },
        create: user_,
        update: user_,
      });
      const userRole_ = {
        factoryId: fac.id,
        userId: user.id,
        role: role as Role,
      };
      await prisma.userRole.upsert({
        where: {
          userId_factoryId: {
            userId: user.id,
            factoryId: fac.id,
          },
        },
        create: userRole_,
        update: userRole_,
      });
    }
  }
}

async function seedDBFactory() {
  for (let a = 0; a < 10; a++) {
    const fac_ = {
      name: `Factory ${a + 1}`,
      code: `FAC_${a + 1}`,
      address: `123 Abc, HCMC, VN`,
    };
    const fac = await prisma.factory.upsert({
      where: { code: fac_.code },
      create: fac_,
      update: fac_,
    });

    for (let b = 0; b < 2; b++) {
      const wor_ = {
        name: `Workshop ${b + 1}`,
        code: `WS_${b + 1}`,
        factoryId: fac.id,
      };
      const wor = await prisma.workshop.upsert({
        where: {
          factoryId_code: {
            factoryId: wor_.factoryId,
            code: wor_.code,
          },
        },
        create: wor_,
        update: wor_,
      });

      for (let c = 0; c < 50; c++) {
        const mac_ = {
          name: `Machine ${c + 1}`,
          code: `${fac_.code}-${wor_.code}-MAC_${c + 1}`,
          workshopId: wor.id,
          infoMachine: `This is description Machine `,
          status: Status_Machine.RUNNING,
          installDate: new Date(),
        };
        const mac = await prisma.machine.upsert({
          where: { code: mac_.code },
          create: mac_,
          update: mac_,
        });

        const device_ = {
          name: `Device ${c + 1}`,
          code: `${mac_.code}-DEV_${c + 1}`,
          machineId: mac.id,
          secretKey: `DEVICE_${c + 1}`,
          status: Status_Device.ACTIVE,
        };
        const dev = await prisma.device.upsert({
          where: { code: device_.code },
          create: device_,
          update: device_,
        });

        for (let d = 0; d < 10; d++) {
          const sen_ = {
            name: `Sensor ${Metrics[d]} ${d + 1}`,
            code: `${mac_.code}-SEN_${d + 1}`,
            machineId: mac.id,
            metric: Metrics[d],
            unit: Units[d],
            status: Status_Sensor.ACTIVE,
          };
          const sen = await prisma.sensor.upsert({
            where: { code: sen_.code },
            create: sen_,
            update: sen_,
          });
        }
      }
    }
  }
}
