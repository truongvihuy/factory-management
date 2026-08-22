export interface AccessTokenPayload {
  userId: string;
}

export interface AccessTokenResult {
  accessToken: string;
  expiresIn: number;
}

export interface JwtServicePort {
  issue(payload: AccessTokenPayload): Promise<AccessTokenResult>;

  verify(token: string): Promise<AccessTokenPayload>;
}
