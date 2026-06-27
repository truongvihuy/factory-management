import { Module } from '@nestjs/common';
import { ClientModule } from '../../../../../libs/clients/client.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [ClientModule],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
