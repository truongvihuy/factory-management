import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigModule } from '@/common/config/config.module';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let prisma: PrismaService;
  let module: TestingModule;

  beforeAll(async () => {
    // create testing module
    module = await Test.createTestingModule({
      imports: [AppConfigModule],
      providers: [PrismaService],
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

  it('should excute a PostgreSQL query successfully', async () => {
    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 AS result`;
    expect(result).toEqual([{ result: 1 }]);
  });
});
