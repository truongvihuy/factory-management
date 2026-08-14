import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { USER_REPOSITORY } from '@/common/constants/repository.constants';
import { UserStatus } from '@/infrastructure/database/prisma/generated';
import { AuthenticationRedisService } from '@/infrastructure/redis/authentication/authentication-redis.service';

import { AccountInactiveError } from '../exceptions/account-inactive.error';
import { AccountLockedError } from '../exceptions/account-locked.error';
import type { AuthenticationUser } from '../interfaces/authentication.types';
import { LoginSecurityPolicy } from './login-security.policy';

describe('LoginSecurityPolicy', () => {
  let policy: LoginSecurityPolicy;

  let userRepository: {
    lockUser: jest.Mock;
    unlockUser: jest.Mock;
    resetLoginSecurityState: jest.Mock;
    updateLastLoginAt: jest.Mock;
  };

  let authenticationRedis: {
    getFailedLoginAttempts: jest.Mock;
    incrementFailedLoginAttempts: jest.Mock;
    resetFailedLoginAttempts: jest.Mock;
  };

  let configService: {
    getOrThrow: jest.Mock;
  };

  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_DURATION_MINUTES = 30;

  const createUser = (overrides: Partial<AuthenticationUser> = {}): AuthenticationUser => ({
    id: 'user-001',
    username: 'huy',
    email: 'huy@example.com',
    displayName: 'Huy',
    passwordHash: 'hashed-password',
    status: UserStatus.ACTIVE,
    lockedUntil: null,
    lastLoginAt: null,
    ...overrides,
  });

  beforeEach(async () => {
    userRepository = {
      lockUser: jest.fn(),
      unlockUser: jest.fn(),
      resetLoginSecurityState: jest.fn(),
      updateLastLoginAt: jest.fn(),
    };

    authenticationRedis = {
      getFailedLoginAttempts: jest.fn(),
      incrementFailedLoginAttempts: jest.fn(),
      resetFailedLoginAttempts: jest.fn(),
    };

    configService = {
      getOrThrow: jest.fn((key: string) => {
        if (key === 'authentication.security.maxLoginAttempts') {
          return MAX_LOGIN_ATTEMPTS;
        }

        if (key === 'authentication.security.lockDurationMinutes') {
          return LOCK_DURATION_MINUTES;
        }

        throw new Error(`Unknown config key: ${key}`);
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoginSecurityPolicy,
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: AuthenticationRedisService,
          useValue: authenticationRedis,
        },
        {
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
      ],
    }).compile();

    policy = module.get<LoginSecurityPolicy>(LoginSecurityPolicy);
  });

  describe('ensureAccountCanLogin', () => {
    it('should allow an active account', async () => {
      const user = createUser({
        status: UserStatus.ACTIVE,
      });

      await expect(policy.ensureAccountCanLogin(user)).resolves.toBeUndefined();
    });

    it('should reject an inactive account', async () => {
      const user = createUser({
        status: UserStatus.INACTIVE,
      });

      await expect(policy.ensureAccountCanLogin(user)).rejects.toBeInstanceOf(AccountInactiveError);
    });

    it('should reject a locked account when lock has not expired', async () => {
      const lockedUntil = new Date(Date.now() + 10 * 60 * 1000);

      const user = createUser({
        status: UserStatus.LOCKED,
        lockedUntil,
      });

      await expect(policy.ensureAccountCanLogin(user)).rejects.toBeInstanceOf(AccountLockedError);

      expect(userRepository.unlockUser).not.toHaveBeenCalled();
    });

    it('should reject a locked account without lockedUntil', async () => {
      const user = createUser({
        status: UserStatus.LOCKED,
        lockedUntil: null,
      });

      await expect(policy.ensureAccountCanLogin(user)).rejects.toBeInstanceOf(AccountLockedError);

      expect(userRepository.unlockUser).not.toHaveBeenCalled();
    });

    it('should unlock an account when lock has expired', async () => {
      const lockedUntil = new Date(Date.now() - 1_000);

      const user = createUser({
        status: UserStatus.LOCKED,
        lockedUntil,
      });

      await expect(policy.ensureAccountCanLogin(user)).resolves.toBeUndefined();

      expect(userRepository.unlockUser).toHaveBeenCalledTimes(1);
      expect(userRepository.unlockUser).toHaveBeenCalledWith(user.id);
    });
  });

  describe('handleFailedLogin', () => {
    it('should increment failed attempts in Redis', async () => {
      const user = createUser();

      authenticationRedis.incrementFailedLoginAttempts.mockResolvedValue(1);

      await policy.handleFailedLogin(user);

      expect(authenticationRedis.incrementFailedLoginAttempts).toHaveBeenCalledTimes(1);
      expect(authenticationRedis.incrementFailedLoginAttempts).toHaveBeenCalledWith(user.id);

      expect(userRepository.lockUser).not.toHaveBeenCalled();
    });

    it('should not lock the account before reaching the threshold', async () => {
      const user = createUser();

      authenticationRedis.incrementFailedLoginAttempts.mockResolvedValue(MAX_LOGIN_ATTEMPTS - 1);

      await policy.handleFailedLogin(user);

      expect(authenticationRedis.incrementFailedLoginAttempts).toHaveBeenCalledWith(user.id);

      expect(userRepository.lockUser).not.toHaveBeenCalled();
    });

    it('should lock the account when threshold is reached', async () => {
      const user = createUser();

      authenticationRedis.incrementFailedLoginAttempts.mockResolvedValue(MAX_LOGIN_ATTEMPTS);

      await policy.handleFailedLogin(user);

      expect(authenticationRedis.incrementFailedLoginAttempts).toHaveBeenCalledWith(user.id);

      expect(userRepository.lockUser).toHaveBeenCalledTimes(1);
      expect(userRepository.lockUser).toHaveBeenCalledWith(user.id, expect.any(Date));
    });

    it('should use configured lock duration', async () => {
      const user = createUser();

      authenticationRedis.incrementFailedLoginAttempts.mockResolvedValue(MAX_LOGIN_ATTEMPTS);

      const before = Date.now();

      await policy.handleFailedLogin(user);

      const after = Date.now();

      const [, lockedUntil] = userRepository.lockUser.mock.calls[0];

      const expectedMin = before + LOCK_DURATION_MINUTES * 60 * 1000;

      const expectedMax = after + LOCK_DURATION_MINUTES * 60 * 1000;

      expect(lockedUntil.getTime()).toBeGreaterThanOrEqual(expectedMin);
      expect(lockedUntil.getTime()).toBeLessThanOrEqual(expectedMax);
    });
  });

  describe('handleSuccessfulLogin', () => {
    it('should reset failed login attempts in Redis', async () => {
      const user = createUser();

      await policy.handleSuccessfulLogin(user);

      expect(authenticationRedis.resetFailedLoginAttempts).toHaveBeenCalledTimes(1);

      expect(authenticationRedis.resetFailedLoginAttempts).toHaveBeenCalledWith(user.id);
    });

    it('should reset login security state in PostgreSQL', async () => {
      const user = createUser();

      await policy.handleSuccessfulLogin(user);

      expect(userRepository.resetLoginSecurityState).toHaveBeenCalledTimes(1);
      expect(userRepository.resetLoginSecurityState).toHaveBeenCalledWith(user.id);
    });

    it('should update lastLoginAt', async () => {
      const user = createUser();

      const before = Date.now();

      await policy.handleSuccessfulLogin(user);

      const after = Date.now();

      expect(userRepository.updateLastLoginAt).toHaveBeenCalledTimes(1);

      const [userId, lastLoginAt] = userRepository.updateLastLoginAt.mock.calls[0];

      expect(userId).toBe(user.id);
      expect(lastLoginAt).toBeInstanceOf(Date);
      expect(lastLoginAt.getTime()).toBeGreaterThanOrEqual(before);
      expect(lastLoginAt.getTime()).toBeLessThanOrEqual(after);
    });

    it('should reset Redis counter before updating PostgreSQL login state', async () => {
      const user = createUser();

      const calls: string[] = [];

      authenticationRedis.resetFailedLoginAttempts.mockImplementation(async () => {
        calls.push('redis');
      });

      userRepository.resetLoginSecurityState.mockImplementation(async () => {
        calls.push('security-state');
      });

      userRepository.updateLastLoginAt.mockImplementation(async () => {
        calls.push('last-login');
      });

      await policy.handleSuccessfulLogin(user);

      expect(calls).toEqual(['redis', 'security-state', 'last-login']);
    });
  });

  describe('invalidCredentials', () => {
    it('should return InvalidCredentialsError', () => {
      const error = policy.invalidCredentials();

      expect(error).toBeInstanceOf(Error);
      expect(error.name).toBe('InvalidCredentialsError');
    });
  });
});
