import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

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
})
export class AuthenticationModule {}
