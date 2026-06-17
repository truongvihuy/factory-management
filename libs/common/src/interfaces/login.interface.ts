import { Permission } from 'generated/prisma';

export interface ILogin {
  email: string;
  password: string;
}

export interface ILoginToken {
  token: string;
}

export interface ILoginPayload {
  sub: string;
  email: string;
  admin: boolean;
  permissions: Permission[];
}

export interface ILoginResponse {
  accessToken: string;
  payload: ILoginPayload;
}
