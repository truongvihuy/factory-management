import { Module } from '@nestjs/common';
import { AuthHandleService } from './auth-handle.service';

@Module({
  providers: [AuthHandleService],
  exports: [AuthHandleService],
})
export class AuthHandleModule {}
