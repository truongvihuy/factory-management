import { Test, TestingModule } from '@nestjs/testing';

import { RedisService } from '../redis.service';
import { AuthenticationRedisService } from './authentication-redis.service';

describe('AuthenticationRedisService', () => {
  let service: AuthenticationRedisService;

  let redisService: {
    get: jest.Mock;
    increment: jest.Mock;
    expire: jest.Mock;
    delete: jest.Mock;
    ttl: jest.Mock;
  };

  beforeEach(async () => {
    redisService = {
      get: jest.fn(),
      increment: jest.fn(),
      expire: jest.fn(),
      delete: jest.fn(),
      ttl: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationRedisService,
        {
          provide: RedisService,
          useValue: redisService,
        },
      ],
    }).compile();

    service = module.get<AuthenticationRedisService>(AuthenticationRedisService);
  });

  describe('getFailedLoginAttempts', () => {
    it('should return 0 when the key does not exist', async () => {
      redisService.get.mockResolvedValue(null);

      await expect(service.getFailedLoginAttempts('huy')).resolves.toBe(0);

      expect(redisService.get).toHaveBeenCalledWith('fms:auth:login:failures:huy');
    });

    it('should return the current number of failed attempts', async () => {
      redisService.get.mockResolvedValue('3');

      await expect(service.getFailedLoginAttempts('huy')).resolves.toBe(3);
    });
  });

  describe('incrementFailedLoginAttempts', () => {
    it('should increment the counter', async () => {
      redisService.increment.mockResolvedValue(2);

      await expect(service.incrementFailedLoginAttempts('huy')).resolves.toBe(2);

      expect(redisService.increment).toHaveBeenCalledWith('fms:auth:login:failures:huy');
    });

    it('should set TTL when the counter is created', async () => {
      redisService.increment.mockResolvedValue(1);

      await service.incrementFailedLoginAttempts('huy');

      expect(redisService.expire).toHaveBeenCalledWith('fms:auth:login:failures:huy', 900);
    });

    it('should not reset TTL when the counter already exists', async () => {
      redisService.increment.mockResolvedValue(2);

      await service.incrementFailedLoginAttempts('huy');

      expect(redisService.expire).not.toHaveBeenCalled();
    });
  });

  describe('resetFailedLoginAttempts', () => {
    it('should delete the failed login counter', async () => {
      await service.resetFailedLoginAttempts('huy');

      expect(redisService.delete).toHaveBeenCalledWith('fms:auth:login:failures:huy');
    });
  });

  describe('getFailedLoginAttemptsTtl', () => {
    it('should return the remaining TTL', async () => {
      redisService.ttl.mockResolvedValue(600);

      await expect(service.getFailedLoginAttemptsTtl('huy')).resolves.toBe(600);

      expect(redisService.ttl).toHaveBeenCalledWith('fms:auth:login:failures:huy');
    });
  });
});
