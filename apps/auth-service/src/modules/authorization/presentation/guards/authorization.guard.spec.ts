import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { ErrorCode } from '@/common/errors/error-code';

import { AccessScope } from '../../domain/value-objects/access-scope.vo';
import { AuthorizationContextPort } from '../../ports/outbound';
import { AuthorizationGuard } from './authorization.guard';

describe('AuthorizationGuard', () => {
  let guard: AuthorizationGuard;

  let reflector: jest.Mocked<Reflector>;
  let authorizationContextPort: jest.Mocked<AuthorizationContextPort>;

  let request: Request;
  let context: ExecutionContext;

  const userId = 'user-123';

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    authorizationContextPort = {
      getByUserId: jest.fn(),
    } as unknown as jest.Mocked<AuthorizationContextPort>;

    request = {
      params: {},
      headers: {},
      user: {
        userId,
      },
    } as unknown as Request;

    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;

    guard = new AuthorizationGuard(reflector, authorizationContextPort);
  });

  describe('endpoint without required permission', () => {
    it('should allow access', async () => {
      reflector.getAllAndOverride.mockReturnValue(undefined);

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(authorizationContextPort.getByUserId).not.toHaveBeenCalled();
    });
  });

  describe('protected endpoint', () => {
    beforeEach(() => {
      reflector.getAllAndOverride.mockReturnValue('user.read');
    });

    it('should reject when authenticated identity is missing', async () => {
      request.user = undefined;

      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_INVALID_ACCESS_TOKEN,
          message: 'Invalid or expired access token',
        },
      });

      expect(authorizationContextPort.getByUserId).not.toHaveBeenCalled();
    });

    it('should load authorization context for authenticated user', async () => {
      authorizationContextPort.getByUserId.mockResolvedValue({
        userId,
        roles: [
          {
            code: 'MANAGER',
            permissions: ['user.read'],
            scope: AccessScope.GLOBAL,
            factoryId: null,
            revokedAt: null,
          },
        ],
      });

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(authorizationContextPort.getByUserId).toHaveBeenCalledTimes(1);

      expect(authorizationContextPort.getByUserId).toHaveBeenCalledWith(userId);
    });

    it('should allow when global role has required permission', async () => {
      authorizationContextPort.getByUserId.mockResolvedValue({
        userId,
        roles: [
          {
            code: 'MANAGER',
            permissions: ['user.read'],
            scope: AccessScope.GLOBAL,
            factoryId: null,
            revokedAt: null,
          },
        ],
      });

      await expect(guard.canActivate(context)).resolves.toBe(true);
    });

    it('should allow when factory role has required permission and factory matches route', async () => {
      request.params = {
        factoryId: 'factory-123',
      };

      authorizationContextPort.getByUserId.mockResolvedValue({
        userId,
        roles: [
          {
            code: 'MANAGER',
            permissions: ['user.read'],
            scope: AccessScope.FACTORY,
            factoryId: 'factory-123',
            revokedAt: null,
          },
        ],
      });

      await expect(guard.canActivate(context)).resolves.toBe(true);
    });

    it('should allow when factory role matches x-factory-id header', async () => {
      request.headers['x-factory-id'] = 'factory-123';

      authorizationContextPort.getByUserId.mockResolvedValue({
        userId,
        roles: [
          {
            code: 'MANAGER',
            permissions: ['user.read'],
            scope: AccessScope.FACTORY,
            factoryId: 'factory-123',
            revokedAt: null,
          },
        ],
      });

      await expect(guard.canActivate(context)).resolves.toBe(true);
    });

    it('should reject when user does not have required permission', async () => {
      authorizationContextPort.getByUserId.mockResolvedValue({
        userId,
        roles: [
          {
            code: 'MANAGER',
            permissions: ['USER_WRITE'],
            scope: AccessScope.GLOBAL,
            factoryId: null,
            revokedAt: null,
          },
        ],
      });

      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_PERMISSION_DENIED,
          message: 'Authorization denied',
        },
      });
    });

    it('should reject when factory does not match', async () => {
      request.params = {
        factoryId: 'factory-999',
      };

      authorizationContextPort.getByUserId.mockResolvedValue({
        userId,
        roles: [
          {
            code: 'VIEW',
            permissions: ['user.read'],
            scope: AccessScope.FACTORY,
            factoryId: 'factory-123',
            revokedAt: null,
          },
        ],
      });

      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_PERMISSION_DENIED,
        },
      });
    });

    it('should reject revoked role', async () => {
      authorizationContextPort.getByUserId.mockResolvedValue({
        userId,
        roles: [
          {
            code: 'MANAGER',
            permissions: ['user.read'],
            scope: AccessScope.GLOBAL,
            factoryId: null,
            revokedAt: new Date(),
          },
        ],
      });

      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_PERMISSION_DENIED,
        },
      });
    });

    it('should propagate authorization context errors', async () => {
      const error = new Error('Failed to load authorization context');

      authorizationContextPort.getByUserId.mockRejectedValue(error);

      await expect(guard.canActivate(context)).rejects.toBe(error);
    });
  });
});
