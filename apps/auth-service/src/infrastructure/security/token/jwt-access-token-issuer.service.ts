import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import type {
  AccessTokenIssuerPort,
  AccessTokenPayload,
  AccessTokenResult,
} from '@/modules/authentication/application/ports/access-token-issuer.port';

@Injectable()
export class JwtAccessTokenIssuerService implements AccessTokenIssuerPort {
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
}
