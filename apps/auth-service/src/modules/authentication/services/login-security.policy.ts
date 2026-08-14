import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { USER_REPOSITORY } from '@/common/constants/repository.constants';
import { UserStatus } from '@/infrastructure/database/prisma/generated';
import { AuthenticationRedisService } from '@/infrastructure/redis/authentication/authentication-redis.service';

import { AccountInactiveError } from '../exceptions/account-inactive.error';
import { AccountLockedError } from '../exceptions/account-locked.error';
import { InvalidCredentialsError } from '../exceptions/invalid-credentials.error';
import type { AuthenticationUser } from '../interfaces/authentication.types';
import type { UserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class LoginSecurityPolicy {
  constructor(
    private readonly configService: ConfigService,
    private readonly authenticationRedis: AuthenticationRedisService,
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
  ) {}

  private get maxLoginAttempts(): number {
    return this.configService.getOrThrow<number>('authentication.security.maxLoginAttempts');
  }

  private get lockDurationMinutes(): number {
    return this.configService.getOrThrow<number>('authentication.security.lockDurationMinutes');
  }

  async ensureAccountCanLogin(user: AuthenticationUser): Promise<void> {
    if (user.status === UserStatus.INACTIVE) {
      throw new AccountInactiveError();
    }

    if (user.status !== UserStatus.LOCKED) {
      return;
    }

    if (user.lockedUntil === null || user.lockedUntil.getTime() > Date.now()) {
      throw new AccountLockedError();
    }

    await this.userRepository.unlockUser(user.id);
  }

  async handleFailedLogin(user: AuthenticationUser): Promise<void> {
    const attempts = await this.authenticationRedis.incrementFailedLoginAttempts(user.id);

    if (attempts < this.maxLoginAttempts) {
      return;
    }

    const lockedUntil = new Date(Date.now() + this.lockDurationMinutes * 60 * 1000);

    await this.userRepository.lockUser(user.id, lockedUntil);
  }

  async handleSuccessfulLogin(user: AuthenticationUser): Promise<void> {
    await this.authenticationRedis.resetFailedLoginAttempts(user.id);

    await this.userRepository.resetLoginSecurityState(user.id);

    await this.userRepository.updateLastLoginAt(user.id, new Date());
  }

  invalidCredentials(): Error {
    return new InvalidCredentialsError();
  }
}
