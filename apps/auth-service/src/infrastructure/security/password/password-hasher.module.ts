import { Module } from '@nestjs/common';

import { PASSWORD_HANSHER } from '@/common/constants/authentication.constants';

import { Argon2PasswordHasherService } from './argon2-password-hasher.service';

@Module({
  providers: [
    {
      provide: PASSWORD_HANSHER,
      useClass: Argon2PasswordHasherService,
    },
  ],
  exports: [
    {
      provide: PASSWORD_HANSHER,
      useClass: Argon2PasswordHasherService,
    },
  ],
})
export class PashwordHasherModule {}
