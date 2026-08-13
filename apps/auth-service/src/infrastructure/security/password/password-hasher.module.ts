import { Module } from '@nestjs/common';

import { Argon2PasswordHasherService } from './argon2-password-hasher.service';

@Module({
  providers: [Argon2PasswordHasherService],
  exports: [Argon2PasswordHasherService],
})
export class PashwordHasherModule {}
