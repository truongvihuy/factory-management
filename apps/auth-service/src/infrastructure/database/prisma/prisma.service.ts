import { Inject, Injectable, type OnModuleDestroy, type OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';

import { AppLoggerService } from '@/infrastructure/logger/app-logger.service';

import { Prisma, PrismaClient } from './generated';
import { DATABASE } from './prisma.token';

@Injectable()
export class PrismaService
  extends PrismaClient<Prisma.PrismaClientOptions, Prisma.LogLevel>
  implements OnModuleInit, OnModuleDestroy
{
  constructor(
    @Inject(DATABASE)
    readonly adapter: PrismaPg,
    private readonly logger: AppLoggerService,
  ) {
    super({
      adapter,
      log: [
        { emit: 'event', level: 'query' },
        // { emit: 'event', level: 'info' },
        // { emit: 'event', level: 'warn' },
        // { emit: 'event', level: 'error' },
      ],
    });
  }

  async onModuleInit(): Promise<void> {
    await this.$connect();

    this.$on('query', (e) => {
      this.logger.log(`Query: ${e.query} \n Params: ${e.params} \n Duration: ${e.duration}ms`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    await this.$disconnect();
  }
}
