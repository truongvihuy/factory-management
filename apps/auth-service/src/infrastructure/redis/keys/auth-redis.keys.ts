import { REDIS_NAMESPACE } from './redis-key.constants';

const AUTH_SERVICE = 'auth';

export const authRedisKeys = {
  failedLoginAttempts: (userId: string): string =>
    `${REDIS_NAMESPACE}:${AUTH_SERVICE}:failed-login-attempts:user:${userId}`,

  loginRateLimit: (identifier: string): string => `${REDIS_NAMESPACE}:${AUTH_SERVICE}:rate-limit:login:${identifier}`,

  session: (userId: string): string => `${REDIS_NAMESPACE}:${AUTH_SERVICE}:session:user:${userId}`,

  refreshToken: (tokenId: string): string => `${REDIS_NAMESPACE}:${AUTH_SERVICE}:refresh-token:${tokenId}`,
};
