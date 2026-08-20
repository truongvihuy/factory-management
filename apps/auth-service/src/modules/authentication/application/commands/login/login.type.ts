export interface LoginSecurityConfig {
  maxLoginAttempts: number;
  lockDurationMinutes: number;
}

export interface InfoSession {
  userAgent: string;
  ip: string;
}

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
