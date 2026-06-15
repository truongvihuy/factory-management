import 'dotenv/config';

import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';
import { Pool } from 'pg';

import { PrismaClient } from '../generated/prisma';
import * as admin from './data/admin.json';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const _admin = await prisma.user.upsert({
    where: { email: admin.email },
    create: {
      name: admin.name,
      email: admin.email,
      password: bcrypt.hashSync(admin.password, 10),
      status: admin.status,
      admin: admin.admin,
    },
    update: {
      name: admin.name,
      email: admin.email,
      password: bcrypt.hashSync(admin.password, 10),
      status: admin.status,
      admin: admin.admin,
    },
  });
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
