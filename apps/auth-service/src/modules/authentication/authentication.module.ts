import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PashwordHasherModule } from '@/infrastructure/security/password/password-hasher.module';
import { AccessTokenModule } from '@/infrastructure/security/token/access-token.module';

import { LoginSecurityConfig, LoginSecurityPolicy } from './application/policies/login-security.policy';
import { AccessTokenPort } from './application/ports/access-token.port';
import {
  ACCESS_TOKEN_PORT,
  LOGIN_ATTEMPT_STORE_PORT,
  PASSWORD_HASHER_PORT,
} from './application/ports/application.token';
import { LoginAttemptStorePort } from './application/ports/login-attempt-store.port';
import { PasswordHasherPort } from './application/ports/password-hasher.port';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthenticationContextRepositoryPort } from './domain/ports/authentication-context.port';
import { AUTHENTICATION_CONTEXT_PORT } from './domain/ports/domain.token';
import { PrismaAuthenticationContextRepository } from './infrastructure/repositories/authentication-context.repository';
import { RedisLoginAttemptStore } from './infrastructure/stores/redis-login-attempt.store';
import { AuthenticationController } from './presentation/controllers/authentication.controller';

@Module({
  imports: [PashwordHasherModule, AccessTokenModule],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: AUTHENTICATION_CONTEXT_PORT,
      useClass: PrismaAuthenticationContextRepository,
    },
    {
      provide: LOGIN_ATTEMPT_STORE_PORT,
      useClass: RedisLoginAttemptStore,
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
      inject: [AUTHENTICATION_CONTEXT_PORT, LOGIN_ATTEMPT_STORE_PORT, ConfigService],
    },
    {
      provide: LoginUseCase,
      useFactory: (
        repository: AuthenticationContextRepositoryPort,
        passwordHasher: PasswordHasherPort,
        accessTokenService: AccessTokenPort,
        loginSecurityPolicy: LoginSecurityPolicy,
      ) => {
        return new LoginUseCase(repository, passwordHasher, accessTokenService, loginSecurityPolicy);
      },
      inject: [AUTHENTICATION_CONTEXT_PORT, PASSWORD_HASHER_PORT, ACCESS_TOKEN_PORT, LoginSecurityPolicy],
    },
  ],
  exports: [],
})
export class AuthenticationModule {}
