import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as argon2 from 'argon2';

import type { PasswordHasherPort } from '@/modules/authentication/application/ports/password-hasher.port';

@Injectable()
export class Argon2PasswordHasherService implements PasswordHasherPort {
  constructor(private readonly configService: ConfigService) {}

  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
      memoryCost: this.configService.getOrThrow<number>('authentication.password.memoryCost'),
      timeCost: this.configService.getOrThrow<number>('authentication.password.timeCost'),
      parallelism: this.configService.getOrThrow<number>('authentication.password.parallelism'),
    });
  }

  async verify(password: string, passwordHash: string): Promise<boolean> {
    try {
      return await argon2.verify(passwordHash, password);
    } catch {
      return false;
    }
  }
}
