import { Test, TestingModule } from '@nestjs/testing';

import { REDIS_CLIENT } from './redis.constants';
import { RedisService } from './redis.service';

describe('RedisService', () => {
  let service: RedisService;

  const redisClient = {
    get: jest.fn(),
    set: jest.fn(),
    del: jest.fn(),
    exists: jest.fn(),
    expire: jest.fn(),
    ttl: jest.fn(),
    ping: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        {
          provide: REDIS_CLIENT,
          useValue: redisClient,
        },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get()', () => {
    it('should return value', async () => {
      redisClient.get.mockResolvedValue('hello');

      const result = await service.get('test:key');

      expect(result).toBe('hello');
      expect(redisClient.get).toHaveBeenCalledWith('test:key');
    });
  });

  describe('set()', () => {
    it('should set value', async () => {
      redisClient.set.mockResolvedValue('OK');

      const result = await service.set('test:key', 'hello');

      expect(result).toBe('OK');

      expect(redisClient.set).toHaveBeenCalledWith('test:key', 'hello');
    });

    it('should set value with TTL', async () => {
      redisClient.set.mockResolvedValue('OK');

      await service.set('test:key', 'hello', 900);

      expect(redisClient.set).toHaveBeenCalledWith('test:key', 'hello', 'EX', 900);
    });
  });

  describe('delete()', () => {
    it('should delete key', async () => {
      redisClient.del.mockResolvedValue(1);

      const result = await service.delete('test:key');

      expect(result).toBe(1);

      expect(redisClient.del).toHaveBeenCalledWith('test:key');
    });
  });

  describe('exists()', () => {
    it('should return true when key exists', async () => {
      redisClient.exists.mockResolvedValue(1);

      await expect(service.exists('test:key')).resolves.toBe(true);
    });

    it('should return false when key does not exist', async () => {
      redisClient.exists.mockResolvedValue(0);

      await expect(service.exists('test:key')).resolves.toBe(false);
    });
  });

  describe('expire()', () => {
    it('should return true when expiration is set', async () => {
      redisClient.expire.mockResolvedValue(1);

      await expect(service.expire('test:key', 900)).resolves.toBe(true);
    });

    it('should return false when key does not exist', async () => {
      redisClient.expire.mockResolvedValue(0);

      await expect(service.expire('test:key', 900)).resolves.toBe(false);
    });
  });

  describe('ttl()', () => {
    it('should return TTL', async () => {
      redisClient.ttl.mockResolvedValue(900);

      await expect(service.ttl('test:key')).resolves.toBe(900);
    });
  });

  describe('ping()', () => {
    it('should return PONG', async () => {
      redisClient.ping.mockResolvedValue('PONG');

      await expect(service.ping()).resolves.toBe('PONG');
    });
  });
});
