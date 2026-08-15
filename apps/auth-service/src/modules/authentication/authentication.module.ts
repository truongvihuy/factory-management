import { Module } from '@nestjs/common';

import { PashwordHasherModule } from '@/infrastructure/security/password/password-hasher.module';
import { AccessTokenIssuerModule } from '@/infrastructure/security/token/access-token-issuer.module';

import { LoginSecurityPolicy } from './application/policies/login-security.policy';
import { LoginUseCase } from './application/use-cases/login.use-case';
import { AuthenticationController } from './presentation/controllers/authentication.controller';

@Module({
  imports: [PashwordHasherModule, AccessTokenIssuerModule],
  controllers: [AuthenticationController],
  providers: [LoginUseCase, LoginSecurityPolicy],
})
export class AuthenticationModule {}
