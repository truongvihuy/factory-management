import { Global, Module } from '@nestjs/common';

import { USER_REPOSITORY } from '@/common/constants/authentication.constants';

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
