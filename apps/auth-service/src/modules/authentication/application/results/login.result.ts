export interface AuthenticationResult {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;

  user: {
    id: string;
    username: string;
    email: string;
    displayName: string;
  };
}
