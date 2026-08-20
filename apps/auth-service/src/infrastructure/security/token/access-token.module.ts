import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { ACCESS_TOKEN_SERVICE_PORT } from '@/modules/authentication/ports/token';
import { JwtAccessTokenService } from './jwt-access-token.service';

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
      provide: ACCESS_TOKEN_SERVICE_PORT,
      useClass: JwtAccessTokenService,
    },
  ],
  exports: [ACCESS_TOKEN_SERVICE_PORT],
})
export class AccessTokenModule {}
