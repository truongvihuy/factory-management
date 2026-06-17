import { RoleUser } from 'generated/prisma';

export interface ILogin {
  email: string;
  password: string;
}

export type ILoginToken = {
  token: string;
};

export interface ILoginPayload {
  sub: string;
  email: string;
  admin: boolean;
  roles: RoleUser[];
}

export interface ILoginResponse {
  accessToken: string;
  payload: ILoginPayload;
}
