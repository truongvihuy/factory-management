export interface AccessTokenPayload {
  userId: string;
}

export interface AccessTokenResult {
  accessToken: string;
  expiresIn: number;
}

export interface AccessTokenIssuerPort {
  issue(payload: AccessTokenPayload): Promise<AccessTokenResult>;
}
