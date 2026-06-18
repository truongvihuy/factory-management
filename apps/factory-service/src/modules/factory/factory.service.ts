import { PrismaService } from '@libs/database';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FactoryService {
  constructor(private readonly prisma: PrismaService) {}

  getFactoryListByIds(factoryIds: string[]) {
    return this.prisma.factory.findMany({ where: { id: { in: factoryIds } } });
  }

  getFactoryListAll() {
    return this.prisma.factory.findMany({});
  }
}
