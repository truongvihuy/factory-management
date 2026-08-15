import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import {
  ACCESS_TOKEN_ISSUER,
  LOGIN_ATTEMPT_STORE,
  PASSWORD_HANSHER,
  USER_REPOSITORY,
} from '@/common/constants/authentication.constants';
import { PashwordHasherModule } from '@/infrastructure/security/password/password-hasher.module';
import { AccessTokenIssuerModule } from '@/infrastructure/security/token/access-token-issuer.module';

import { LoginSecurityConfig, LoginSecurityPolicy } from './application/policies/login-security.policy';
import { AccessTokenIssuerPort } from './application/ports/access-token-issuer.port';
import { LoginAttemptStorePort } from './application/ports/login-attempt-store.port';
import { PasswordHasherPort } from './application/ports/password-hasher.port';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { UserRepositoryPort } from './domain/ports/user-repository.port';
import { AuthenticationController } from './presentation/controllers/authentication.controller';

@Module({
  imports: [PashwordHasherModule, AccessTokenIssuerModule],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: LoginUseCase,
      useFactory: (
        userRepository: UserRepositoryPort,
        passwordHasher: PasswordHasherPort,
        accessTokenIssuer: AccessTokenIssuerPort,
        loginSecurityPolicy: LoginSecurityPolicy,
      ) => {
        return new LoginUseCase(userRepository, passwordHasher, accessTokenIssuer, loginSecurityPolicy);
      },
      inject: [USER_REPOSITORY, PASSWORD_HANSHER, ACCESS_TOKEN_ISSUER, LoginSecurityPolicy],
    },
    {
      provide: LoginSecurityPolicy,
      useFactory: (
        userRepository: UserRepositoryPort,
        loginAttemptStore: LoginAttemptStorePort,
        configService: ConfigService,
      ) => {
        const config: LoginSecurityConfig = {
          maxLoginAttempts: configService.getOrThrow<number>('authentication.security.maxLoginAttempts'),
          lockDurationMinutes: configService.getOrThrow<number>('authentication.security.lockDurationMinutes'),
        };
        return new LoginSecurityPolicy(userRepository, loginAttemptStore, config);
      },
      inject: [USER_REPOSITORY, LOGIN_ATTEMPT_STORE, ConfigService],
    },
  ],
})
export class AuthenticationModule {}
