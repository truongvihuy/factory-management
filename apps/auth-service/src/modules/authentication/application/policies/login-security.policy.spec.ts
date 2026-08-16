import { getCallSites } from 'node:util';

import { AuthenticationUser, AuthenticationUserStatus } from '../../domain/entities/authentication-user.entity';
import { AuthenticationContextRepositoryPort } from '../../domain/ports/authentication-context.port';
import type { LoginAttemptStorePort } from '../ports/login-attempt-store.port';
import { LoginSecurityPolicy, type LoginSecurityConfig } from './login-security.policy';

describe('LoginSecurityPolicy', () => {
  let policy: LoginSecurityPolicy;

  let repository: jest.Mocked<AuthenticationContextRepositoryPort>;
  let loginAttemptStore: jest.Mocked<LoginAttemptStorePort>;

  let config: LoginSecurityConfig;

  let user: AuthenticationUser;

  beforeEach(() => {
    repository = {
      findByIdentifier: jest.fn(),
      lockUser: jest.fn(),
      unlockUser: jest.fn(),
      resetLoginSecurityState: jest.fn(),
      updateLastLoginAt: jest.fn(),
    };

    loginAttemptStore = {
      getFailedAttempts: jest.fn(),
      incrementFailedAttempts: jest.fn(),
      resetFailedAttempts: jest.fn(),
      getTtl: jest.fn(),
    };

    config = {
      maxLoginAttempts: 5,
      lockDurationMinutes: 15,
    };

    policy = new LoginSecurityPolicy(repository, loginAttemptStore, config);

    user = AuthenticationUser.create({
      id: 'user-123',
      username: 'huy',
      email: 'huy@example.com',
      displayName: 'Huy',
      passwordHash: 'hashed-password',
      status: AuthenticationUserStatus.ACTIVE,
    });
  });

  describe('handleFailedLogin', () => {
    it('should increment failed login attempts', async () => {
      loginAttemptStore.incrementFailedAttempts.mockResolvedValue(1);

      await policy.handleFailedLogin(user);

      expect(loginAttemptStore.incrementFailedAttempts).toHaveBeenCalledTimes(1);

      expect(loginAttemptStore.incrementFailedAttempts).toHaveBeenCalledWith(user.id);
    });

    it('should not lock account when failed attempts are below threshold', async () => {
      loginAttemptStore.incrementFailedAttempts.mockResolvedValue(4);

      await policy.handleFailedLogin(user);

      expect(loginAttemptStore.incrementFailedAttempts).toHaveBeenCalledWith(user.id);

      expect(repository.lockUser).not.toHaveBeenCalled();
    });

    it('should lock account when failed attempts reach threshold', async () => {
      loginAttemptStore.incrementFailedAttempts.mockResolvedValue(5);

      const before = Date.now();

      await policy.handleFailedLogin(user);

      const after = Date.now();

      expect(repository.lockUser).toHaveBeenCalledTimes(1);

      const calls = repository.lockUser.mock.calls[0];

      expect(calls).toBeDefined();

      if (!calls) {
        throw new Error('lockUser was not called');
      }

      const [userId, lockedUntil] = calls;

      expect(userId).toBe(user.id);
      expect(lockedUntil).toBeInstanceOf(Date);

      const expectedMinimum = before + config.lockDurationMinutes * 60 * 1000;

      const expectedMaximum = after + config.lockDurationMinutes * 60 * 1000;

      expect(lockedUntil.getTime()).toBeGreaterThanOrEqual(expectedMinimum);

      expect(lockedUntil.getTime()).toBeLessThanOrEqual(expectedMaximum);
    });

    it('should lock account when failed attempts exceed threshold', async () => {
      loginAttemptStore.incrementFailedAttempts.mockResolvedValue(6);

      await policy.handleFailedLogin(user);

      expect(repository.lockUser).toHaveBeenCalledTimes(1);

      expect(repository.lockUser).toHaveBeenCalledWith(user.id, expect.any(Date));
    });

    it('should not perform repository operations when increment fails', async () => {
      const error = new Error('Redis unavailable');

      loginAttemptStore.incrementFailedAttempts.mockRejectedValue(error);

      await expect(policy.handleFailedLogin(user)).rejects.toBe(error);

      expect(repository.lockUser).not.toHaveBeenCalled();
    });
  });

  describe('handleSuccessfulLogin', () => {
    it('should reset failed login attempts', async () => {
      loginAttemptStore.resetFailedAttempts.mockResolvedValue();

      await policy.handleSuccessfulLogin(user);

      expect(loginAttemptStore.resetFailedAttempts).toHaveBeenCalledTimes(1);

      expect(loginAttemptStore.resetFailedAttempts).toHaveBeenCalledWith(user.id);
    });

    it('should reset login security state', async () => {
      loginAttemptStore.resetFailedAttempts.mockResolvedValue();
      repository.resetLoginSecurityState.mockResolvedValue();
      repository.updateLastLoginAt.mockResolvedValue();

      await policy.handleSuccessfulLogin(user);

      expect(repository.resetLoginSecurityState).toHaveBeenCalledTimes(1);

      expect(repository.resetLoginSecurityState).toHaveBeenCalledWith(user.id);
    });

    it('should update last login time', async () => {
      loginAttemptStore.resetFailedAttempts.mockResolvedValue();
      repository.resetLoginSecurityState.mockResolvedValue();
      repository.updateLastLoginAt.mockResolvedValue();

      const before = Date.now();

      await policy.handleSuccessfulLogin(user);

      const after = Date.now();

      expect(repository.updateLastLoginAt).toHaveBeenCalledTimes(1);

      const calls = repository.updateLastLoginAt.mock.calls[0];

      expect(getCallSites).toBeDefined();

      if (!calls) {
        throw new Error('updateLastLoginAt was not called');
      }

      const [userId, lastLoginAt] = calls;

      expect(userId).toBe(user.id);
      expect(lastLoginAt).toBeInstanceOf(Date);

      expect(lastLoginAt.getTime()).toBeGreaterThanOrEqual(before);
      expect(lastLoginAt.getTime()).toBeLessThanOrEqual(after);
    });

    it('should execute security state updates in the expected order', async () => {
      loginAttemptStore.resetFailedAttempts.mockResolvedValue();
      repository.resetLoginSecurityState.mockResolvedValue();
      repository.updateLastLoginAt.mockResolvedValue();

      const calls: string[] = [];

      loginAttemptStore.resetFailedAttempts.mockImplementation(async () => {
        calls.push('resetFailedAttempts');
      });

      repository.resetLoginSecurityState.mockImplementation(async () => {
        calls.push('resetLoginSecurityState');
      });

      repository.updateLastLoginAt.mockImplementation(async () => {
        calls.push('updateLastLoginAt');
      });

      await policy.handleSuccessfulLogin(user);

      expect(calls).toEqual(['resetFailedAttempts', 'resetLoginSecurityState', 'updateLastLoginAt']);
    });

    it('should stop when resetting failed login attempts fails', async () => {
      const error = new Error('Redis unavailable');

      loginAttemptStore.resetFailedAttempts.mockRejectedValue(error);

      await expect(policy.handleSuccessfulLogin(user)).rejects.toBe(error);

      expect(repository.resetLoginSecurityState).not.toHaveBeenCalled();

      expect(repository.updateLastLoginAt).not.toHaveBeenCalled();
    });
  });
});
