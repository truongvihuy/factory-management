export interface AccessTokenPayload {
  userId: string;
}

export interface AccessTokenIssuer {
  issue(payload: { userId: string }): Promise<string>;
}
