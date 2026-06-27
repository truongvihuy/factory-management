import { AuthHandleModule } from '@libs/auth';
import { PrismaModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule, AuthHandleModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
