import { Injectable } from '@nestjs/common';
import * as argon2 from 'argon2';

import type { PasswordHasher } from '@/modules/authentication/interfaces/password-hasher.interface';

@Injectable()
export class Argon2PasswordHasherService implements PasswordHasher {
  async hash(password: string): Promise<string> {
    return argon2.hash(password, {
      type: argon2.argon2id,
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
