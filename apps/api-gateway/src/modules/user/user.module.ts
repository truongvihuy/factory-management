import { Module } from '@nestjs/common';
import { ClientModule } from '../../clients/client.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
