import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { LOGIN_ATTEMPT_STORE, USER_REPOSITORY } from '@/common/constants/authentication.constants';

import { AuthenticationUser } from '../domain/entities/authentication-user.entity';
import { InvalidCredentialsDomainError } from '../domain/exceptions/invalid-credentials.domain-error';
import type { UserRepositoryPort } from '../domain/ports/user-repository.port';
import type { LoginAttemptStore } from '../interfaces/login-attempt-store.interface';

@Injectable()
export class LoginSecurityPolicy {
  constructor(
    private readonly configService: ConfigService,
    @Inject(USER_REPOSITORY)
    private readonly userRepositoryPort: UserRepositoryPort,
    @Inject(LOGIN_ATTEMPT_STORE)
    private readonly loginAttemptStore: LoginAttemptStore,
  ) {}

  private get maxLoginAttempts(): number {
    return this.configService.getOrThrow<number>('authentication.security.maxLoginAttempts');
  }

  private get lockDurationMinutes(): number {
    return this.configService.getOrThrow<number>('authentication.security.lockDurationMinutes');
  }

  async handleFailedLogin(user: AuthenticationUser): Promise<void> {
    const attempts = await this.loginAttemptStore.incrementAttempts(user.id);

    if (attempts < this.maxLoginAttempts) {
      return;
    }

    const lockedUntil = new Date(Date.now() + this.lockDurationMinutes * 60 * 1000);

    await this.userRepositoryPort.lockUser(user.id, lockedUntil);
  }

  async handleSuccessfulLogin(user: AuthenticationUser): Promise<void> {
    await this.loginAttemptStore.resetAttempts(user.id);

    await this.userRepositoryPort.resetLoginSecurityState(user.id);

    await this.userRepositoryPort.updateLastLoginAt(user.id, new Date());
  }

  invalidCredentials(): Error {
    return new InvalidCredentialsDomainError();
  }
}
