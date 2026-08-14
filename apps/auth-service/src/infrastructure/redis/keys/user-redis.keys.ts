import { REDIS_NAMESPACE } from './redis-key.constants';

const USER_SERVICE = 'user';

export const userRedisKeys = {
  profile: (userId: string) => `${REDIS_NAMESPACE}:${USER_SERVICE}:cache:profile:${userId}`,
};
