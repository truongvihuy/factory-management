import { REDIS_NAMESPACE } from './redis-key.constants';
import { userRedisKeys } from './user-redis.keys';

describe('userRedisKeys', () => {
  describe('profile', () => {
    it('should generate the correct profile cache key', () => {
      const userId = 'user-123';

      const key = userRedisKeys.profile(userId);

      expect(key).toBe(`${REDIS_NAMESPACE}:user:cache:profile:user-123`);
    });

    it('should generate different keys for different users', () => {
      const firstKey = userRedisKeys.profile('user-123');
      const secondKey = userRedisKeys.profile('user-456');

      expect(firstKey).not.toBe(secondKey);
    });

    it('should preserve the user id in the generated key', () => {
      const userId = '550e8400-e29b-41d4-a716-446655440000';

      const key = userRedisKeys.profile(userId);

      expect(key).toContain(userId);
    });
  });
});
