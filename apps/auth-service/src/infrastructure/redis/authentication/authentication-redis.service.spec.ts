import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

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

  let configService: {
    getOrThrow: jest.Mock;
  };

  const failureWindowSeconds = 15 * 60;

  beforeEach(async () => {
    redisService = {
      get: jest.fn(),
      increment: jest.fn(),
      expire: jest.fn(),
      delete: jest.fn(),
      ttl: jest.fn(),
    };

    configService = {
      getOrThrow: jest.fn().mockReturnValue(failureWindowSeconds),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthenticationRedisService,
        {
          provide: RedisService,
          useValue: redisService,
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
      ],
    }).compile();

    service = module.get<AuthenticationRedisService>(AuthenticationRedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFailedLoginAttempts', () => {
    it('should return failed login attempts when value exists', async () => {
      redisService.get.mockResolvedValue('3');

      const result = await service.getFailedLoginAttempts('user-001');

      expect(result).toBe(3);

      expect(redisService.get).toHaveBeenCalledWith(expect.stringContaining('failed-login-attempts:user:user-001'));
    });

    it('should return 0 when counter does not exist', async () => {
      redisService.get.mockResolvedValue(null);

      const result = await service.getFailedLoginAttempts('user-001');

      expect(result).toBe(0);

      expect(redisService.get).toHaveBeenCalledTimes(1);
    });

    it('should convert Redis string value to number', async () => {
      redisService.get.mockResolvedValue('5');

      const result = await service.getFailedLoginAttempts('user-001');

      expect(result).toBe(5);
      expect(typeof result).toBe('number');
    });
  });

  describe('incrementFailedLoginAttempts', () => {
    it('should increment failed login attempts', async () => {
      redisService.increment.mockResolvedValue(1);
      redisService.expire.mockResolvedValue(true);

      const result = await service.incrementFailedLoginAttempts('user-001');

      expect(result).toBe(1);

      expect(redisService.increment).toHaveBeenCalledWith(
        expect.stringContaining('failed-login-attempts:user:user-001'),
      );
    });

    it('should set expiration when counter is created', async () => {
      redisService.increment.mockResolvedValue(1);
      redisService.expire.mockResolvedValue(true);

      await service.incrementFailedLoginAttempts('user-001');

      expect(redisService.expire).toHaveBeenCalledTimes(1);

      expect(redisService.expire).toHaveBeenCalledWith(
        expect.stringContaining('failed-login-attempts:user:user-001'),
        failureWindowSeconds,
      );
    });

    it('should not reset expiration when counter already exists', async () => {
      redisService.increment.mockResolvedValue(2);

      const result = await service.incrementFailedLoginAttempts('user-001');

      expect(result).toBe(2);

      expect(redisService.expire).not.toHaveBeenCalled();
    });

    it('should not reset expiration for subsequent attempts', async () => {
      redisService.increment.mockResolvedValueOnce(1).mockResolvedValueOnce(2).mockResolvedValueOnce(3);

      redisService.expire.mockResolvedValue(true);

      await service.incrementFailedLoginAttempts('user-001');
      await service.incrementFailedLoginAttempts('user-001');
      await service.incrementFailedLoginAttempts('user-001');

      expect(redisService.increment).toHaveBeenCalledTimes(3);

      expect(redisService.expire).toHaveBeenCalledTimes(1);
    });

    it('should use configured failure window', async () => {
      redisService.increment.mockResolvedValue(1);

      await service.incrementFailedLoginAttempts('user-001');

      expect(configService.getOrThrow).toHaveBeenCalledWith('authentication.security.failureWindowSeconds');

      expect(redisService.expire).toHaveBeenCalledWith(expect.any(String), failureWindowSeconds);
    });
  });

  describe('resetFailedLoginAttempts', () => {
    it('should delete failed login counter', async () => {
      redisService.delete.mockResolvedValue(1);

      await service.resetFailedLoginAttempts('user-001');

      expect(redisService.delete).toHaveBeenCalledTimes(1);

      expect(redisService.delete).toHaveBeenCalledWith(expect.stringContaining('failed-login-attempts:user:user-001'));
    });

    it('should not throw when counter does not exist', async () => {
      redisService.delete.mockResolvedValue(0);

      await expect(service.resetFailedLoginAttempts('user-001')).resolves.toBeUndefined();

      expect(redisService.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFailedLoginAttemptsTtl', () => {
    it('should return remaining TTL', async () => {
      redisService.ttl.mockResolvedValue(600);

      const result = await service.getFailedLoginAttemptsTtl('user-001');

      expect(result).toBe(600);

      expect(redisService.ttl).toHaveBeenCalledWith(expect.stringContaining('failed-login-attempts:user:user-001'));
    });

    it('should return -1 when counter has no expiration', async () => {
      redisService.ttl.mockResolvedValue(-1);

      const result = await service.getFailedLoginAttemptsTtl('user-001');

      expect(result).toBe(-1);
    });

    it('should return -2 when counter does not exist', async () => {
      redisService.ttl.mockResolvedValue(-2);

      const result = await service.getFailedLoginAttemptsTtl('user-001');

      expect(result).toBe(-2);
    });
  });
});
