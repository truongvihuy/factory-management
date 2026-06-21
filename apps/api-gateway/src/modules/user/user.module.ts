import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { AuthClient } from '../../clients/auth.client';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [HttpModule],
  controllers: [UserController],
  providers: [UserService, AuthClient],
})
export class UserModule {}
