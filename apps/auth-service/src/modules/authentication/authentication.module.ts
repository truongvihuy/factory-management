import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { PashwordHasherModule } from '@/infrastructure/security/password/password-hasher.module';
import { JWTModule } from '@/infrastructure/security/token/jwt.module';
import { AuthorizationModule } from '@/modules/authorization/authorization.module';

import { LoginSecurityConfig } from './application/commands/login/login.type';
import { PrismaUserRepository } from './infrastructure/persistence/repositories/user.repository';
import { RedisLoginAttemptStore } from './infrastructure/stores/redis-login-attempt.store';
import { RedisSessionStore } from './infrastructure/stores/redis-session.store';
import {
  LOGIN_ATTEMPT_STORE_PORT,
  LOGIN_SECURITY_CONFIG,
  SESSION_STORE_PORT,
  USER_REPOSITORY_PORT,
} from './ports/token';
import { AuthenticationController } from './presentation/controllers/authentication.controller';

@Module({
  imports: [PashwordHasherModule, JWTModule, AuthorizationModule],
  controllers: [AuthenticationController],
  providers: [
    {
      provide: USER_REPOSITORY_PORT,
      useClass: PrismaUserRepository,
    },
    {
      provide: LOGIN_ATTEMPT_STORE_PORT,
      useClass: RedisLoginAttemptStore,
    },
    {
      provide: SESSION_STORE_PORT,
      useClass: RedisSessionStore,
    },
    {
      provide: LOGIN_SECURITY_CONFIG,
      useFactory: (configService: ConfigService): LoginSecurityConfig => {
        const config: LoginSecurityConfig = {
          maxLoginAttempts: configService.getOrThrow<number>('authentication.security.maxLoginAttempts'),
          lockDurationMinutes: configService.getOrThrow<number>('authentication.security.lockDurationMinutes'),
        };
        return config;
      },
      inject: [ConfigService],
    },
  ],
  exports: [],
})
export class AuthenticationModule {}
