import { PermissionCode } from '../constants/permission.constant';

export interface ILogin {
  email: string;
  password: string;
}

export interface IChangePassword {
  currentPassword: string;
  newPassword: string;
  exceptSessionId?: string;
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

export interface ICheckUserRole {
  userId: string;
  factoryId: string;
  permission: PermissionCode;
}

export interface IRefreshTokenPayload {
  sub: string;
  sessionId: string;
}

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
}
