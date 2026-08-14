import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ACCESS_TOKEN_ISSUER, PASSWORD_HANSHER } from '@/common/constants/authentication.constants';
import { USER_REPOSITORY } from '@/common/constants/repository.constants';
import { PrismaUserRepository } from '@/infrastructure/database/prisma/repositories/user.repository';
import { Argon2PasswordHasherService } from '@/infrastructure/security/password/argon2-password-hasher.service';
import { JwtAccessTokenIssuerService } from '@/infrastructure/security/token/jwt-access-token-issuer.service';

import { AuthenticationController } from './controllers/authentication.controller';
import { LoginSecurityPolicy } from './services/login-security.policy';
import { LoginUseCase } from './services/login.use-case';

@Module({
  imports: [
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.getOrThrow<string>('authentication.token.secret'),
        issuer: config.getOrThrow<string>('authentication.token.issuer'),
        audience: config.getOrThrow<string>('authentication.token.audience'),
        signOptions: {
          expiresIn: config.getOrThrow<number>('authentication.token.accessTokenTtlSeconds'),
        },
      }),
    }),
  ],
  controllers: [AuthenticationController],
  providers: [
    LoginUseCase,
    {
      provide: USER_REPOSITORY,
      useClass: PrismaUserRepository,
    },
    {
      provide: PASSWORD_HANSHER,
      useClass: Argon2PasswordHasherService,
    },
    {
      provide: ACCESS_TOKEN_ISSUER,
      useClass: JwtAccessTokenIssuerService,
    },
    LoginSecurityPolicy,
  ],
})
export class AuthenticationModule {}
