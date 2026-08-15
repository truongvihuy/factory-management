import { Test, TestingModule } from '@nestjs/testing';

import { AppConfigModule } from '@/common/config/config.module';

import { PrismaModule } from './prisma.module';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let module: TestingModule;
  let prisma: PrismaService;

  beforeAll(async () => {
    // create testing module
    module = await Test.createTestingModule({
      imports: [AppConfigModule, PrismaModule],
    }).compile();

    prisma = module.get<PrismaService>(PrismaService);
  });

  afterAll(async () => {
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
