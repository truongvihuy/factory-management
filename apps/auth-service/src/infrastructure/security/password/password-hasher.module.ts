import { Module } from '@nestjs/common';

import { PASSWORD_HASHER_PORT } from '@/modules/authentication/ports/outbound/application.token';

import { Argon2PasswordHasherService } from './argon2-password-hasher.service';

@Module({
  providers: [
    {
      provide: PASSWORD_HASHER_PORT,
      useClass: Argon2PasswordHasherService,
    },
  ],
  exports: [PASSWORD_HASHER_PORT],
})
export class PashwordHasherModule {}
