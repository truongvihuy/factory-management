import { Module } from '@nestjs/common';

import { PashwordHasherModule } from '@/infrastructure/security/password/password-hasher.module';
import { AccessTokenIssuerModule } from '@/infrastructure/security/token/access-token-issuer.module';
import { AuthenticationController } from './controllers/authentication.controller';
import { LoginSecurityPolicy } from './services/login-security.policy';
import { LoginUseCase } from './services/login.use-case';

@Module({
  imports: [PashwordHasherModule, AccessTokenIssuerModule],
  controllers: [AuthenticationController],
  providers: [LoginUseCase, LoginSecurityPolicy],
})
export class AuthenticationModule {}
