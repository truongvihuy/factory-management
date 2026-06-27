import { ClientModule } from '@libs/clients/client.module';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';

@Module({
  imports: [ClientModule],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
