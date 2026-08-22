import { Inject } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

import { UserEntity } from '@/modules/authentication/domain/entities';
import {
  AccountInactiveError,
  AccountLockedError,
  InvalidCredentialsError,
} from '@/modules/authentication/domain/errors';
import { LoginHandlerPort } from '@/modules/authentication/ports/inbound';
import {
  AccessTokenServicePort,
  LoginAttemptStorePort,
  PasswordHasherPort,
  SessionStorePort,
  UserRepositoryPort,
} from '@/modules/authentication/ports/outbound';
import {
  ACCESS_TOKEN_SERVICE_PORT,
  LOGIN_ATTEMPT_STORE_PORT,
  LOGIN_SECURITY_CONFIG,
  PASSWORD_HASHER_PORT,
  SESSION_STORE_PORT,
  USER_REPOSITORY_PORT,
} from '@/modules/authentication/ports/token';
import { LoginCommand } from './login.command';
import { AuthenticationResult, InfoSession, LoginSecurityConfig } from './login.type';

@CommandHandler(LoginCommand)
export class LoginHandler implements ICommandHandler<LoginCommand>, LoginHandlerPort {
  constructor(
    @Inject(USER_REPOSITORY_PORT)
    private readonly repository: UserRepositoryPort,
    @Inject(LOGIN_ATTEMPT_STORE_PORT)
    private readonly loginAttemptStore: LoginAttemptStorePort,
    @Inject(SESSION_STORE_PORT)
    private readonly sessionStore: SessionStorePort,
    @Inject(ACCESS_TOKEN_SERVICE_PORT)
    private readonly accessTokenService: AccessTokenServicePort,
    @Inject(PASSWORD_HASHER_PORT)
    private readonly passwordHasher: PasswordHasherPort,
    @Inject(LOGIN_SECURITY_CONFIG)
    private readonly config: LoginSecurityConfig,
  ) {}

  async execute(command: LoginCommand): Promise<AuthenticationResult> {
    const user = await this.repository.findByIdentifier(command.identifier);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    LoginHandler.ensureCanLogin(user);

    const passwordValid = await this.passwordHasher.verify(command.password, user.passwordHash);

    if (!passwordValid) {
      await this.handleFailedLogin(user);

      throw new InvalidCredentialsError();
    }

    await this.handleSuccessfulLogin(user, { ip: command.ip, userAgent: command.userAgent });

    const token = await this.accessTokenService.issue({
      userId: user.id,
    });

    return {
      accessToken: token.accessToken,
      tokenType: 'Bearer',
      expiresIn: token.expiresIn,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        displayName: user.displayName,
      },
    };
  }

  static ensureCanLogin(user: UserEntity): void {
    if (user.isInactive()) {
      throw new AccountInactiveError();
    }

    if (user.isLocked()) {
      throw new AccountLockedError();
    }
  }

  private async handleFailedLogin(user: UserEntity): Promise<void> {
    const attempts = await this.loginAttemptStore.incrementFailedAttempts(user.id);

    if (attempts < this.config.maxLoginAttempts) {
      return;
    }

    const lockedUntil = new Date(Date.now() + this.config.lockDurationMinutes * 60 * 1000);

    await this.repository.lockUser(user.id, lockedUntil);
  }

  private async handleSuccessfulLogin(user: UserEntity, infoSession: InfoSession): Promise<void> {
    await this.loginAttemptStore.resetFailedAttempts(user.id);

    await this.repository.resetLoginSecurityState(user.id);

    await this.repository.updateLastLoginAt(user.id, new Date());

    await this.sessionStore.register({
      userId: user.id,
      userAgent: infoSession.userAgent,
      ip: infoSession.ip,
    });
  }
}
