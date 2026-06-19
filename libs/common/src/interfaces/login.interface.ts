export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginToken {
  token: string;
}

export interface IAccessTokenPayload {
  sub: string;
  sessionId: string;
  email: string;
}

export interface IRefreshTokenPayload {
  sub: string;
  sessionId: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}
