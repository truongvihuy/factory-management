import { CacheService } from './cache.service';

describe('CacheService', () => {
  let service: CacheService;

  let redisService: {
    get: jest.Mock;
    set: jest.Mock;
    delete: jest.Mock;
    exists: jest.Mock;
  };

  beforeEach(() => {
    redisService = {
      get: jest.fn(),
      set: jest.fn(),
      delete: jest.fn(),
      exists: jest.fn(),
    };

    service = new CacheService(redisService as never);
  });

  describe('get()', () => {
    it('should return null when cache key does not exist', async () => {
      redisService.get.mockResolvedValue(null);

      const result = await service.get('user:key');

      expect(result).toBeNull();

      expect(redisService.get).toHaveBeenCalledWith('user:key');

      expect(redisService.get).toHaveBeenCalledTimes(1);
    });

    it('should deserialize and return cached value', async () => {
      const cachedValue = {
        id: 'user-123',
        name: 'Huy',
      };

      redisService.get.mockResolvedValue(JSON.stringify(cachedValue));

      const result = await service.get<typeof cachedValue>('user:key');

      expect(result).toEqual(cachedValue);

      expect(redisService.get).toHaveBeenCalledWith('user:key');

      expect(redisService.get).toHaveBeenCalledTimes(1);
    });
  });

  describe('set()', () => {
    it('should serialize value and store it in Redis', async () => {
      const value = {
        id: 'user-123',
        name: 'Huy',
      };

      redisService.set.mockResolvedValue(undefined);

      await service.set('user:key', value);

      expect(redisService.set).toHaveBeenCalledWith('user:key', JSON.stringify(value), undefined);

      expect(redisService.set).toHaveBeenCalledTimes(1);
    });

    it('should pass TTL to RedisService', async () => {
      const value = {
        id: 'user-123',
      };

      const ttlSeconds = 300;

      redisService.set.mockResolvedValue(undefined);

      await service.set('user:key', value, ttlSeconds);

      expect(redisService.set).toHaveBeenCalledWith('user:key', JSON.stringify(value), ttlSeconds);
    });
  });

  describe('delete()', () => {
    it('should delete the specified cache key', async () => {
      redisService.delete.mockResolvedValue(undefined);

      await service.delete('user:key');

      expect(redisService.delete).toHaveBeenCalledWith('user:key');

      expect(redisService.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('exists()', () => {
    it('should return true when cache key exists', async () => {
      redisService.exists.mockResolvedValue(true);

      const result = await service.exists('user:key');

      expect(result).toBe(true);

      expect(redisService.exists).toHaveBeenCalledWith('user:key');

      expect(redisService.exists).toHaveBeenCalledTimes(1);
    });

    it('should return false when cache key does not exist', async () => {
      redisService.exists.mockResolvedValue(false);

      const result = await service.exists('user:key');

      expect(result).toBe(false);

      expect(redisService.exists).toHaveBeenCalledWith('user:key');

      expect(redisService.exists).toHaveBeenCalledTimes(1);
    });

    it('should propagate Redis errors when getting value', async () => {
      const error = new Error('Redis unavailable');

      redisService.get.mockRejectedValue(error);

      await expect(service.get('user:key')).rejects.toThrow('Redis unavailable');
    });

    it('should propagate Redis errors when setting value', async () => {
      const error = new Error('Redis unavailable');

      redisService.set.mockRejectedValue(error);

      await expect(service.set('user:key', { id: 'user-123' })).rejects.toThrow('Redis unavailable');
    });
  });
});
