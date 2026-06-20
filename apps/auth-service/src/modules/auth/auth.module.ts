import { AuthHandleModule } from '@libs/auth';
import { PrismaModule } from '@libs/database';
import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule, AuthHandleModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
