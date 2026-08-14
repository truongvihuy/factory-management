import {
  AuthenticationUser,
  AuthenticationUserStatus,
  type AuthenticationUserProps,
} from '../entities/authentication-user.entity';
import { AccountInactiveDomainError } from '../exceptions/account-inactive.domain-error';
import { AccountLockedDomainError } from '../exceptions/account-locked.domain-error';
import { AccountLoginRule } from './account-login.rule';

describe('AccountLoginRule', () => {
  const baseProps: AuthenticationUserProps = {
    id: 'user-1',
    username: 'huy',
    email: 'huy@example.com',
    displayName: 'Huy',
    passwordHash: 'hash',
    status: AuthenticationUserStatus.ACTIVE,
    lockedUntil: null,
    lastLoginAt: null,
  };

  const createUser = (overrides: Partial<AuthenticationUserProps> = {}): AuthenticationUser => {
    return new AuthenticationUser({
      ...baseProps,
      ...overrides,
    });
  };

  describe('ACTIVE account', () => {
    it('should allow login', () => {
      const user = createUser({
        status: AuthenticationUserStatus.ACTIVE,
      });

      expect(() => AccountLoginRule.ensureCanLogin(user)).not.toThrow();
    });
  });

  describe('INACTIVE account', () => {
    it('should reject login', () => {
      const user = createUser({
        status: AuthenticationUserStatus.INACTIVE,
      });

      expect(() => AccountLoginRule.ensureCanLogin(user)).toThrow(AccountInactiveDomainError);
    });
  });

  describe('LOCKED account', () => {
    it('should reject login when lock has not expired', () => {
      const lockedUntil = new Date(Date.now() + 5 * 60 * 1000);

      const user = createUser({
        status: AuthenticationUserStatus.LOCKED,
        lockedUntil,
      });

      expect(() => AccountLoginRule.ensureCanLogin(user)).toThrow(AccountLockedDomainError);
    });

    it('should reject login when lockedUntil is null', () => {
      const user = createUser({
        status: AuthenticationUserStatus.LOCKED,
        lockedUntil: null,
      });

      expect(() => AccountLoginRule.ensureCanLogin(user)).toThrow(AccountLockedDomainError);
    });

    it('should allow login when lock has expired', () => {
      const lockedUntil = new Date(Date.now() - 5 * 60 * 1000);

      const user = createUser({
        status: AuthenticationUserStatus.LOCKED,
        lockedUntil,
      });

      expect(() => AccountLoginRule.ensureCanLogin(user)).not.toThrow();
    });
  });
});
