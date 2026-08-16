import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ACCESS_TOKEN_ISSUER_PORT } from '@/modules/authentication/application/ports/application.token';

import { JwtAccessTokenIssuerService } from './jwt-access-token-issuer.service';

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
  providers: [
    {
      provide: ACCESS_TOKEN_ISSUER_PORT,
      useClass: JwtAccessTokenIssuerService,
    },
  ],
  exports: [ACCESS_TOKEN_ISSUER_PORT],
})
export class AccessTokenIssuerModule {}
