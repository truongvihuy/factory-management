import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { LOGIN_ATTEMPT_STORE } from '@/common/constants/authentication.constants';
import { LoginAttemptStore } from '@/modules/authentication/interfaces/login-attempt-store.interface';
import { RedisService } from '../redis.service';
import { RedisLoginAttemptStore } from './login-attempt.store';

describe('RedisLoginAttemptStore', () => {
  let store: LoginAttemptStore;

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
        {
          provide: LOGIN_ATTEMPT_STORE,
          useClass: RedisLoginAttemptStore,
        },
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

    store = module.get<LoginAttemptStore>(LOGIN_ATTEMPT_STORE);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFailedLoginAttempts', () => {
    it('should return failed login attempts when value exists', async () => {
      redisService.get.mockResolvedValue('3');

      const result = await store.getAttempts('user-001');

      expect(result).toBe(3);

      expect(redisService.get).toHaveBeenCalledWith(expect.stringContaining('failed-login-attempts:user:user-001'));
    });

    it('should return 0 when counter does not exist', async () => {
      redisService.get.mockResolvedValue(null);

      const result = await store.getAttempts('user-001');

      expect(result).toBe(0);

      expect(redisService.get).toHaveBeenCalledTimes(1);
    });

    it('should convert Redis string value to number', async () => {
      redisService.get.mockResolvedValue('5');

      const result = await store.getAttempts('user-001');

      expect(result).toBe(5);
      expect(typeof result).toBe('number');
    });
  });

  describe('incrementFailedLoginAttempts', () => {
    it('should increment failed login attempts', async () => {
      redisService.increment.mockResolvedValue(1);
      redisService.expire.mockResolvedValue(true);

      const result = await store.incrementAttempts('user-001');

      expect(result).toBe(1);

      expect(redisService.increment).toHaveBeenCalledWith(
        expect.stringContaining('failed-login-attempts:user:user-001'),
      );
    });

    it('should set expiration when counter is created', async () => {
      redisService.increment.mockResolvedValue(1);
      redisService.expire.mockResolvedValue(true);

      await store.incrementAttempts('user-001');

      expect(redisService.expire).toHaveBeenCalledTimes(1);

      expect(redisService.expire).toHaveBeenCalledWith(
        expect.stringContaining('failed-login-attempts:user:user-001'),
        failureWindowSeconds,
      );
    });

    it('should not reset expiration when counter already exists', async () => {
      redisService.increment.mockResolvedValue(2);

      const result = await store.incrementAttempts('user-001');

      expect(result).toBe(2);

      expect(redisService.expire).not.toHaveBeenCalled();
    });

    it('should not reset expiration for subsequent attempts', async () => {
      redisService.increment.mockResolvedValueOnce(1).mockResolvedValueOnce(2).mockResolvedValueOnce(3);

      redisService.expire.mockResolvedValue(true);

      await store.incrementAttempts('user-001');
      await store.incrementAttempts('user-001');
      await store.incrementAttempts('user-001');

      expect(redisService.increment).toHaveBeenCalledTimes(3);

      expect(redisService.expire).toHaveBeenCalledTimes(1);
    });

    it('should use configured failure window', async () => {
      redisService.increment.mockResolvedValue(1);

      await store.incrementAttempts('user-001');

      expect(configService.getOrThrow).toHaveBeenCalledWith('authentication.security.failureWindowSeconds');

      expect(redisService.expire).toHaveBeenCalledWith(expect.any(String), failureWindowSeconds);
    });
  });

  describe('resetFailedLoginAttempts', () => {
    it('should delete failed login counter', async () => {
      redisService.delete.mockResolvedValue(1);

      await store.resetAttempts('user-001');

      expect(redisService.delete).toHaveBeenCalledTimes(1);

      expect(redisService.delete).toHaveBeenCalledWith(expect.stringContaining('failed-login-attempts:user:user-001'));
    });

    it('should not throw when counter does not exist', async () => {
      redisService.delete.mockResolvedValue(0);

      await expect(store.resetAttempts('user-001')).resolves.toBeUndefined();

      expect(redisService.delete).toHaveBeenCalledTimes(1);
    });
  });

  describe('getFailedLoginAttemptsTtl', () => {
    it('should return remaining TTL', async () => {
      redisService.ttl.mockResolvedValue(600);

      const result = await store.getTtl('user-001');

      expect(result).toBe(600);

      expect(redisService.ttl).toHaveBeenCalledWith(expect.stringContaining('failed-login-attempts:user:user-001'));
    });

    it('should return -1 when counter has no expiration', async () => {
      redisService.ttl.mockResolvedValue(-1);

      const result = await store.getTtl('user-001');

      expect(result).toBe(-1);
    });

    it('should return -2 when counter does not exist', async () => {
      redisService.ttl.mockResolvedValue(-2);

      const result = await store.getTtl('user-001');

      expect(result).toBe(-2);
    });
  });
});
