import { Inject, Injectable } from '@nestjs/common';

import { ACCESS_TOKEN_ISSUER, PASSWORD_HANSHER } from '@/common/constants/authentication.constants';
import { USER_REPOSITORY } from '@/common/constants/repository.constants';
import { CacheService } from '@/infrastructure/cache/cache.service';

import type { AccessTokenIssuer } from '../interfaces/access-token-issuer.interface';
import type { AuthenticationResult } from '../interfaces/authentication.types';
import type { PasswordHasher } from '../interfaces/password-hasher.interface';
import type { UserRepository } from '../interfaces/user-repository.interface';
import { LoginSecurityPolicy } from './login-security.policy';

@Injectable()
export class LoginUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepository,
    private readonly cacheService: CacheService,
    @Inject(PASSWORD_HANSHER)
    private readonly passwordHasher: PasswordHasher,
    @Inject(ACCESS_TOKEN_ISSUER)
    private readonly accessTokenIssuer: AccessTokenIssuer,
    private readonly loginSecurityPolicy: LoginSecurityPolicy,
  ) {}

  async execute(identifier: string, password: string): Promise<AuthenticationResult> {
    const user = await this.userRepository.findByIdentifier(identifier);

    if (!user) {
      throw this.loginSecurityPolicy.invalidCredentials();
    }

    this.loginSecurityPolicy.ensureAccountCanLogin(user);

    const passwordValid = await this.passwordHasher.verify(password, user.passwordHash);

    if (!passwordValid) {
      await this.loginSecurityPolicy.handleFailedLogin(user);

      throw this.loginSecurityPolicy.invalidCredentials();
    }

    await this.loginSecurityPolicy.handleSuccessfulLogin(user);

    const token = await this.accessTokenIssuer.issue({
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
}
