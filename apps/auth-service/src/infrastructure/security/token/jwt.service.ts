import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type {
  AccessTokenPayload,
  AccessTokenResult,
  JwtServicePort,
} from '@/modules/authentication/ports/outbound/access-token-service.port';

@Injectable()
export class JwtAccessTokenService implements JwtServicePort {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async issue(payload: AccessTokenPayload): Promise<AccessTokenResult> {
    const accessToken = await this.jwtService.signAsync({
      sub: payload.userId,
    });

    const expiresIn = this.configService.getOrThrow<number>('authentication.token.accessTokenTtlSeconds');

    return {
      accessToken,
      expiresIn,
    };
  }

  async verify(token: string): Promise<AccessTokenPayload> {
    return this.jwtService.verifyAsync<AccessTokenPayload>(token);
  }
}
