import { PrismaModule } from '@libs/database';
import { Module } from '@nestjs/common';

import { JwtService } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [PrismaModule],
  controllers: [AuthController],
  providers: [AuthService, JwtService],
})
export class AuthModule {}
