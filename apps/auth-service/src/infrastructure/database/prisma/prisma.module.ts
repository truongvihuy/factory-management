import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { PrismaService } from './prisma.service';
import { DATABASE } from './prisma.token';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: DATABASE,
      useFactory: (configService: ConfigService): PrismaPg => {
        const connectionString = configService.getOrThrow('database.url');
        return new PrismaPg({ connectionString });
      },
      inject: [ConfigService],
    },
  ],
  exports: [PrismaService, DATABASE],
})
export class PrismaModule {}
