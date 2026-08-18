import { ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';

import { ErrorCode } from '@/common/errors/error-code';

import type { AccessTokenPort } from '../../application/ports/access-token.port';
import { AuthenticationGuard } from './authentication.guard';

describe('AuthenticationGuard', () => {
  let guard: AuthenticationGuard;
  let reflector: jest.Mocked<Reflector>;
  let accessTokenPort: jest.Mocked<AccessTokenPort>;

  let request: Request;
  let context: ExecutionContext;

  beforeEach(() => {
    reflector = {
      getAllAndOverride: jest.fn(),
    } as unknown as jest.Mocked<Reflector>;

    accessTokenPort = {
      verify: jest.fn(),
    } as unknown as jest.Mocked<AccessTokenPort>;

    request = {
      headers: {},
    } as Request;

    context = {
      getHandler: jest.fn(),
      getClass: jest.fn(),
      switchToHttp: jest.fn().mockReturnValue({
        getRequest: jest.fn().mockReturnValue(request),
      }),
    } as unknown as ExecutionContext;

    guard = new AuthenticationGuard(reflector, accessTokenPort);
  });

  describe('public endpoint', () => {
    it('should allow access without authentication', async () => {
      reflector.getAllAndOverride.mockReturnValue(true);

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(accessTokenPort.verify).not.toHaveBeenCalled();
    });
  });

  describe('protected endpoint', () => {
    beforeEach(() => {
      reflector.getAllAndOverride.mockReturnValue(false);
    });

    it('should reject when authorization header is missing', async () => {
      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_MISSING_ACCESS_TOKEN,
          message: 'Access token is required',
        },
      });

      expect(accessTokenPort.verify).not.toHaveBeenCalled();
    });

    it('should reject when authorization scheme is not Bearer', async () => {
      request.headers.authorization = 'Basic abc123';

      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_INVALID_ACCESS_TOKEN,
          message: 'Invalid or expired access token',
        },
      });

      expect(accessTokenPort.verify).not.toHaveBeenCalled();
    });

    it('should reject when Bearer token is missing', async () => {
      request.headers.authorization = 'Bearer';

      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_INVALID_ACCESS_TOKEN,
          message: 'Invalid or expired access token',
        },
      });

      expect(accessTokenPort.verify).not.toHaveBeenCalled();
    });

    it('should reject when token verification fails', async () => {
      request.headers.authorization = 'Bearer invalid-token';

      accessTokenPort.verify.mockRejectedValue(new Error('Invalid token'));

      await expect(guard.canActivate(context)).rejects.toMatchObject({
        response: {
          code: ErrorCode.AUTH_INVALID_ACCESS_TOKEN,
          message: 'Invalid or expired access token',
        },
      });

      expect(accessTokenPort.verify).toHaveBeenCalledTimes(1);
      expect(accessTokenPort.verify).toHaveBeenCalledWith('invalid-token');
    });

    it('should authenticate user when token is valid', async () => {
      request.headers.authorization = 'Bearer valid-token';

      const identity = {
        userId: 'user-123',
      };

      accessTokenPort.verify.mockResolvedValue(identity);

      await expect(guard.canActivate(context)).resolves.toBe(true);

      expect(accessTokenPort.verify).toHaveBeenCalledTimes(1);
      expect(accessTokenPort.verify).toHaveBeenCalledWith('valid-token');

      expect(request.user).toEqual(identity);
    });
  });
});
