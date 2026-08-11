export interface AccessTokenPayload {
  userId: string;
}

export interface AccessTokenResult {
  accessToken: string;
  expiresIn: number;
}

export interface AccessTokenIssuer {
  issue(payload: { userId: string }): Promise<AccessTokenResult>;
}
