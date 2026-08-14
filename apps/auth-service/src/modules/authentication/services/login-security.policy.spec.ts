import { ConfigService } from '@nestjs/config';
import { Test, type TestingModule } from '@nestjs/testing';

import { LOGIN_ATTEMPT_STORE, USER_REPOSITORY } from '@/common/constants/authentication.constants';

import { AuthenticationUser, AuthenticationUserStatus } from '../domain/entities/authentication-user.entity';
import { LoginSecurityPolicy } from './login-security.policy';

describe('LoginSecurityPolicy', () => {
  let policy: LoginSecurityPolicy;

  let userRepository: {
    lockUser: jest.Mock;
    unlockUser: jest.Mock;
    resetLoginSecurityState: jest.Mock;
    updateLastLoginAt: jest.Mock;
  };

  let loginAttemptStore: {
    getAttempts: jest.Mock;
    incrementAttempts: jest.Mock;
    resetAttempts: jest.Mock;
    getTtl: jest.Mock;
  };

  let configService: {
    getOrThrow: jest.Mock;
  };

  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCK_DURATION_MINUTES = 30;

  const createUser = (overrides: Partial<AuthenticationUser> = {}): AuthenticationUser =>
    new AuthenticationUser({
      id: 'user-001',
      username: 'huy',
      email: 'huy@example.com',
      displayName: 'Huy',
      passwordHash: 'hashed-password',
      status: AuthenticationUserStatus.ACTIVE,
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

    loginAttemptStore = {
      getAttempts: jest.fn(),
      incrementAttempts: jest.fn(),
      resetAttempts: jest.fn(),
      getTtl: jest.fn(),
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
          provide: USER_REPOSITORY,
          useValue: userRepository,
        },
        {
          provide: LOGIN_ATTEMPT_STORE,
          useValue: loginAttemptStore,
        },
      ],
    }).compile();

    policy = module.get<LoginSecurityPolicy>(LoginSecurityPolicy);
  });

  describe('handleFailedLogin', () => {
    it('should increment failed attempts in Redis', async () => {
      const user = createUser();

      loginAttemptStore.incrementAttempts.mockResolvedValue(1);

      await policy.handleFailedLogin(user);

      expect(loginAttemptStore.incrementAttempts).toHaveBeenCalledTimes(1);
      expect(loginAttemptStore.incrementAttempts).toHaveBeenCalledWith(user.id);

      expect(userRepository.lockUser).not.toHaveBeenCalled();
    });

    it('should not lock the account before reaching the threshold', async () => {
      const user = createUser();

      loginAttemptStore.incrementAttempts.mockResolvedValue(MAX_LOGIN_ATTEMPTS - 1);

      await policy.handleFailedLogin(user);

      expect(loginAttemptStore.incrementAttempts).toHaveBeenCalledWith(user.id);

      expect(userRepository.lockUser).not.toHaveBeenCalled();
    });

    it('should lock the account when threshold is reached', async () => {
      const user = createUser();

      loginAttemptStore.incrementAttempts.mockResolvedValue(MAX_LOGIN_ATTEMPTS);

      await policy.handleFailedLogin(user);

      expect(loginAttemptStore.incrementAttempts).toHaveBeenCalledWith(user.id);

      expect(userRepository.lockUser).toHaveBeenCalledTimes(1);
      expect(userRepository.lockUser).toHaveBeenCalledWith(user.id, expect.any(Date));
    });

    it('should use configured lock duration', async () => {
      const user = createUser();

      loginAttemptStore.incrementAttempts.mockResolvedValue(MAX_LOGIN_ATTEMPTS);

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

      expect(loginAttemptStore.resetAttempts).toHaveBeenCalledTimes(1);

      expect(loginAttemptStore.resetAttempts).toHaveBeenCalledWith(user.id);
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

      loginAttemptStore.resetAttempts.mockImplementation(async () => {
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
      expect(error.name).toBe('InvalidCredentialsDomainError');
    });
  });
});
