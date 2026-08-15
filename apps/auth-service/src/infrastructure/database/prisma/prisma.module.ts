import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaPg } from '@prisma/adapter-pg';

import { DATABASE, USER_REPOSITORY } from '@/common/constants/authentication.constants';

import { PrismaService } from './prisma.service';
import { PrismaUserRepository } from './repositories/user.repository';

@Global()
@Module({
  providers: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: DATABASE,
      useFactory: (configService: ConfigService) => {
        const connectionString = configService.getOrThrow('database.url');
        return new PrismaPg({ connectionString });
      },
      inject: [ConfigService],
    },
  ],
  exports: [
    PrismaService,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
  ],
})
export class PrismaModule {}
