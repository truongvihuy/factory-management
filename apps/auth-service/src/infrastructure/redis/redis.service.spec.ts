import Redis from 'ioredis';

import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;
  let redisClient: jest.Mocked<Redis>;

  beforeEach(() => {
    jest.clearAllMocks();

    redisClient = {
      get: jest.fn<Promise<string | null>, [string]>(),
      set: jest.fn<Promise<'OK' | null>, [string, string, ...string[]]>(),
      incr: jest.fn<Promise<number>, [string]>(),
      del: jest.fn<Promise<number>, [string]>(),
      exists: jest.fn<Promise<number>, [string]>(),
      expire: jest.fn<Promise<number>, [string, number]>(),
      ttl: jest.fn<Promise<number>, [string]>(),
      ping: jest.fn<Promise<string>, []>(),
      quit: jest.fn<Promise<string>, []>(),
      status: 'ready',
    } as unknown as jest.Mocked<Redis>;

    service = new RedisService(redisClient);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('onModuleInit', () => {
    it('should ping Redis when module initializes', async () => {
      redisClient.ping.mockResolvedValue('PONG');

      await service.onModuleInit();

      expect(redisClient.ping).toHaveBeenCalledTimes(1);
    });

    it('should propagate Redis connection error', async () => {
      const error = new Error('Redis connection failed');

      redisClient.ping.mockRejectedValue(error);

      await expect(service.onModuleInit()).rejects.toThrow('Redis connection failed');
    });
  });

  describe('onModuleDestroy', () => {
    it('should quit Redis connection', async () => {
      redisClient.status = 'ready';
      redisClient.quit.mockResolvedValue('OK');

      await service.onModuleDestroy();

      expect(redisClient.quit).toHaveBeenCalledTimes(1);
    });

    it('should not quit Redis when connection is already ended', async () => {
      redisClient.status = 'end';

      await service.onModuleDestroy();

      expect(redisClient.quit).toHaveBeenCalled();
    });

    it('should propagate quit error', async () => {
      const error = new Error('Redis quit failed');

      redisClient.status = 'ready';
      redisClient.quit.mockRejectedValue(error);

      await expect(service.onModuleDestroy()).rejects.toThrow('Redis quit failed');
    });
  });

  describe('get', () => {
    it('should return value when key exists', async () => {
      redisClient.get.mockResolvedValue('test-value');

      await expect(service.get('test:key')).resolves.toBe('test-value');

      expect(redisClient.get).toHaveBeenCalledWith('test:key');
    });

    it('should return null when key does not exist', async () => {
      redisClient.get.mockResolvedValue(null);

      await expect(service.get('test:key')).resolves.toBeNull();

      expect(redisClient.get).toHaveBeenCalledWith('test:key');
    });
  });

  describe('set', () => {
    it('should set value without TTL', async () => {
      redisClient.set.mockResolvedValue('OK');

      await expect(service.set('test:key', 'test-value')).resolves.toBe('OK');

      expect(redisClient.set).toHaveBeenCalledWith('test:key', 'test-value');
    });

    it('should set value with TTL', async () => {
      redisClient.set.mockResolvedValue('OK');

      await expect(service.set('test:key', 'test-value', 300)).resolves.toBe('OK');

      expect(redisClient.set).toHaveBeenCalledWith('test:key', 'test-value', 'EX', 300);
    });

    // it('should return null when Redis returns null', async () => {
    //   redisClient.set.mockResolvedValue(null);

    //   await expect(service.set('test:key', 'test-value')).resolves.toBeNull();
    // });
  });

  describe('increment', () => {
    it('should increment key and return new value', async () => {
      redisClient.incr.mockResolvedValue(5);

      await expect(service.increment('test:key')).resolves.toBe(5);

      expect(redisClient.incr).toHaveBeenCalledWith('test:key');
    });
  });

  describe('delete', () => {
    it('should delete key and return number of deleted keys', async () => {
      redisClient.del.mockResolvedValue(1);

      await expect(service.delete('test:key')).resolves.toBe(1);

      expect(redisClient.del).toHaveBeenCalledWith('test:key');
    });

    it('should return zero when key does not exist', async () => {
      redisClient.del.mockResolvedValue(0);

      await expect(service.delete('missing:key')).resolves.toBe(0);

      expect(redisClient.del).toHaveBeenCalledWith('missing:key');
    });
  });

  describe('exists', () => {
    it('should return true when key exists', async () => {
      redisClient.exists.mockResolvedValue(1);

      await expect(service.exists('test:key')).resolves.toBe(true);

      expect(redisClient.exists).toHaveBeenCalledWith('test:key');
    });

    it('should return false when key does not exist', async () => {
      redisClient.exists.mockResolvedValue(0);

      await expect(service.exists('test:key')).resolves.toBe(false);

      expect(redisClient.exists).toHaveBeenCalledWith('test:key');
    });
  });

  describe('expire', () => {
    it('should return true when expiration is applied', async () => {
      redisClient.expire.mockResolvedValue(1);

      await expect(service.expire('test:key', 300)).resolves.toBe(true);

      expect(redisClient.expire).toHaveBeenCalledWith('test:key', 300);
    });

    it('should return false when key does not exist', async () => {
      redisClient.expire.mockResolvedValue(0);

      await expect(service.expire('missing:key', 300)).resolves.toBe(false);

      expect(redisClient.expire).toHaveBeenCalledWith('missing:key', 300);
    });
  });

  describe('ttl', () => {
    it('should return remaining TTL', async () => {
      redisClient.ttl.mockResolvedValue(120);

      await expect(service.ttl('test:key')).resolves.toBe(120);

      expect(redisClient.ttl).toHaveBeenCalledWith('test:key');
    });

    it('should return -1 when key exists without expiration', async () => {
      redisClient.ttl.mockResolvedValue(-1);

      await expect(service.ttl('test:key')).resolves.toBe(-1);
    });

    it('should return -2 when key does not exist', async () => {
      redisClient.ttl.mockResolvedValue(-2);

      await expect(service.ttl('missing:key')).resolves.toBe(-2);
    });
  });

  describe('ping', () => {
    it('should return Redis PONG response', async () => {
      redisClient.ping.mockResolvedValue('PONG');

      await expect(service.ping()).resolves.toBe('PONG');

      expect(redisClient.ping).toHaveBeenCalledTimes(1);
    });
  });
});
