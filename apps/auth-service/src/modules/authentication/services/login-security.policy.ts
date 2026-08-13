import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UserStatus } from '@/prisma/generated';

import { AccountInactiveError } from '../exceptions/account-inactive.error';
import { AccountLockedError } from '../exceptions/account-locked.error';
import { InvalidCredentialsError } from '../exceptions/invalid-credentials.error';
import type { AuthenticationUser } from '../interfaces/authentication.types';
import type { UserRepository } from '../interfaces/user-repository.interface';

@Injectable()
export class LoginSecurityPolicy {
  constructor(
    private readonly configService: ConfigService,
    @Inject('USER_REPOSITORY')
    private readonly userRepository: UserRepository,
  ) {}

  private get maxLoginAttempts(): number {
    return this.configService.getOrThrow<number>('authentication.security.maxLoginAttempts');
  }

  private get lockDurationMinutes(): number {
    return this.configService.getOrThrow<number>('authentication.security.lockDurationMinutes');
  }

  ensureAccountCanLogin(user: AuthenticationUser): void {
    if (user.status === UserStatus.INACTIVE) {
      throw new AccountInactiveError();
    }

    if (user.status !== UserStatus.LOCKED) {
      return;
    }

    if (user.lockedUntil !== null && user.lockedUntil.getTime() <= Date.now()) {
      return;
    }

    throw new AccountLockedError();
  }

  async handleFailedLogin(user: AuthenticationUser): Promise<void> {
    const nextFailedAttempts = user.failedLoginAttempts + 1;

    if (nextFailedAttempts >= this.maxLoginAttempts) {
      const lockedUntil = new Date(Date.now() + this.lockDurationMinutes * 60 * 1000);

      await this.userRepository.lockUser(user.id, lockedUntil);

      return;
    }

    await this.userRepository.incrementFailedLoginAttempts(user.id);
  }

  async handleSuccessfulLogin(user: AuthenticationUser): Promise<void> {
    const now = new Date();

    await this.userRepository.resetFailedLoginAttempts(user.id);

    await this.userRepository.updateLastLoginAt(user.id, now);
  }

  invalidCredentials(): Error {
    return new InvalidCredentialsError();
  }
}
