export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
}

export interface IForgotPassword {
  email: string;
}

export interface IResetPassword {
  token: string;
  newPassword: string;
}

export interface IToken {
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
