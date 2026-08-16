import { AuthorizationDeniedError } from '../errors/authorization-denied.error';
import type { AuthorizationContext } from '../models/authorization-context';
import { AccessScope } from '../value-objects/access-scope.vo';
import { AuthorizationRule } from './authorization.rule';

describe('AuthorizationRule', () => {
  const factoryA = 'factory-a';
  const factoryB = 'factory-b';

  const createContext = (overrides: Partial<AuthorizationContext> = {}): AuthorizationContext => ({
    userId: 'user-1',
    roles: [],
    ...overrides,
  });

  describe('GLOBAL scope', () => {
    it('should allow access to any factory', () => {
      const context = createContext({
        roles: [
          {
            code: 'ADMIN',
            permissions: ['machine.read'],
            scope: AccessScope.GLOBAL,
            factoryId: null,
            revokedAt: null,
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.read',
          factoryId: factoryA,
        }),
      ).not.toThrow();
    });

    it('should allow access without factory context', () => {
      const context = createContext({
        roles: [
          {
            code: 'ADMIN',
            permissions: ['machine.read'],
            scope: AccessScope.GLOBAL,
            factoryId: null,
            revokedAt: null,
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.read',
          factoryId: null,
        }),
      ).not.toThrow();
    });
  });

  describe('FACTORY scope', () => {
    it('should allow access to assigned factory', () => {
      const context = createContext({
        roles: [
          {
            code: 'FACTORY_MANAGER',
            permissions: ['machine.read'],
            scope: AccessScope.FACTORY,
            factoryId: factoryA,
            revokedAt: null,
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.read',
          factoryId: factoryA,
        }),
      ).not.toThrow();
    });

    it('should deny access to another factory', () => {
      const context = createContext({
        roles: [
          {
            code: 'FACTORY_MANAGER',
            permissions: ['machine.read'],
            scope: AccessScope.FACTORY,
            factoryId: factoryA,
            revokedAt: null,
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.read',
          factoryId: factoryB,
        }),
      ).toThrow(AuthorizationDeniedError);
    });

    it('should deny factory-scoped access without factory context', () => {
      const context = createContext({
        roles: [
          {
            code: 'FACTORY_MANAGER',
            permissions: ['machine.read'],
            scope: AccessScope.FACTORY,
            factoryId: factoryA,
            revokedAt: null,
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.read',
          factoryId: null,
        }),
      ).toThrow(AuthorizationDeniedError);
    });
  });

  describe('permission', () => {
    it('should deny when permission is not assigned', () => {
      const context = createContext({
        roles: [
          {
            code: 'OPERATOR',
            permissions: ['machine.read'],
            scope: AccessScope.FACTORY,
            factoryId: factoryA,
            revokedAt: null,
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.delete',
          factoryId: factoryA,
        }),
      ).toThrow(AuthorizationDeniedError);
    });
  });

  describe('revoked role assignment', () => {
    it('should deny access when role assignment is revoked', () => {
      const context = createContext({
        roles: [
          {
            code: 'FACTORY_MANAGER',
            permissions: ['machine.read'],
            scope: AccessScope.FACTORY,
            factoryId: factoryA,
            revokedAt: new Date(),
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.read',
          factoryId: factoryA,
        }),
      ).toThrow(AuthorizationDeniedError);
    });
  });

  describe('multiple roles', () => {
    it('should allow access when any active role grants permission', () => {
      const context = createContext({
        roles: [
          {
            code: 'OPERATOR',
            permissions: ['machine.read'],
            scope: AccessScope.FACTORY,
            factoryId: factoryA,
            revokedAt: new Date(),
          },
          {
            code: 'ADMIN',
            permissions: ['machine.delete'],
            scope: AccessScope.GLOBAL,
            factoryId: null,
            revokedAt: null,
          },
        ],
      });

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.delete',
          factoryId: factoryB,
        }),
      ).not.toThrow();
    });
  });

  describe('no roles', () => {
    it('should deny access', () => {
      const context = createContext();

      expect(() =>
        AuthorizationRule.ensureCanAccess(context, {
          permission: 'machine.read',
          factoryId: factoryA,
        }),
      ).toThrow(AuthorizationDeniedError);
    });
  });
});
