import { REDIS_NAMESPACE } from './redis-key.constants';

const AUTH_SERVICE = 'auth';

export const authRedisKeys = {
  session: (userId: string): string => `${REDIS_NAMESPACE}:${AUTH_SERVICE}:session:user:${userId}`,

  loginAttempt: (userId: string): string => `${REDIS_NAMESPACE}:${AUTH_SERVICE}:login-attempt:user:${userId}`,

  refreshToken: (tokenId: string): string => `${REDIS_NAMESPACE}:${AUTH_SERVICE}:refresh-token:${tokenId}`,

  loginRateLimit: (identifier: string): string => `${REDIS_NAMESPACE}:${AUTH_SERVICE}:rate-limit:login:${identifier}`,
};
