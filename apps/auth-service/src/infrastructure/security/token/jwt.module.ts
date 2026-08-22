import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { JWT_SERVICE_PORT } from '@/modules/authentication/ports/token';
import { JwtAccessTokenService } from './jwt.service';

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
      provide: JWT_SERVICE_PORT,
      useClass: JwtAccessTokenService,
    },
  ],
  exports: [JWT_SERVICE_PORT],
})
export class JWTModule {}
