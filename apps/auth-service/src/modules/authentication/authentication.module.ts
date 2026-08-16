import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PashwordHasherModule } from '@/infrastructure/security/password/password-hasher.module';
import { AccessTokenIssuerModule } from '@/infrastructure/security/token/access-token-issuer.module';

import { LoginSecurityConfig, LoginSecurityPolicy } from './application/policies/login-security.policy';
import { AccessTokenIssuerPort } from './application/ports/access-token-issuer.port';
import { LoginAttemptStorePort } from './application/ports/login-attempt-store.port';
import { PasswordHasherPort } from './application/ports/password-hasher.port';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthenticationContextRepositoryPort } from './domain/ports/authentication-context.port';
import { AuthenticationController } from './presentation/controllers/authentication.controller';

@Module({
  imports: [PashwordHasherModule, AccessTokenIssuerModule],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (
        repository: AuthenticationContextRepositoryPort,
        passwordHasher: PasswordHasherPort,
        accessTokenIssuer: AccessTokenIssuerPort,
        loginSecurityPolicy: LoginSecurityPolicy,
      ) => {
        return new LoginUseCase(repository, passwordHasher, accessTokenIssuer, loginSecurityPolicy);
      },
      inject: [AUTHENTICATION_CONTEXT, PASSWORD_HANSHER, ACCESS_TOKEN_ISSUER, LoginSecurityPolicy],
    },
    {
      provide: LoginSecurityPolicy,
      useFactory: (
        repository: AuthenticationContextRepositoryPort,
        loginAttemptStore: LoginAttemptStorePort,
        configService: ConfigService,
      ) => {
        const config: LoginSecurityConfig = {
          maxLoginAttempts: configService.getOrThrow<number>('authentication.security.maxLoginAttempts'),
          lockDurationMinutes: configService.getOrThrow<number>('authentication.security.lockDurationMinutes'),
        };
        return new LoginSecurityPolicy(repository, loginAttemptStore, config);
      },
      inject: [USER_REPOSITORY, LOGIN_ATTEMPT_STORE, ConfigService],
    },
  ],
})
export class AuthenticationModule {}
