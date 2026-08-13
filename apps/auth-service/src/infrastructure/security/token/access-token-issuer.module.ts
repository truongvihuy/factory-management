import { Module } from '@nestjs/common';

import { JwtAccessTokenIssuerService } from './jwt-access-token-issuer.service';

@Module({
  providers: [JwtAccessTokenIssuerService],
  exports: [JwtAccessTokenIssuerService],
})
export class AccessTokenIssuerModule {}
