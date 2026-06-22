import { HttpStatus, ValidationError } from '@nestjs/common';
import { ErrorCode } from '../constants/errors.enum';
import { AppException } from './app.exception';

export class Exceptions {
  static invalidCredetials(): never {
    throw new AppException(HttpStatus.UNAUTHORIZED, {
      code: ErrorCode.INVALID_CREDENTIALS,
      message: 'Invalid credentials',
    });
  }

  static missingToken(): never {
    throw new AppException(HttpStatus.UNAUTHORIZED, {
      code: ErrorCode.MISSING_TOKEN,
      message: 'Missing Token or Bearer/Basic token is not provided',
    });
  }

  static authBlocked(): never {
    throw new AppException(HttpStatus.FORBIDDEN, {
      code: ErrorCode.AUTH_BLOCKED,
      message: 'User is blocked',
    });
  }

  static tokenExpired(): never {
    throw new AppException(HttpStatus.UNAUTHORIZED, {
      code: ErrorCode.TOKEN_EXPIRED,
      message: 'Token exprired',
    });
  }

  static invalidToken(): never {
    throw new AppException(HttpStatus.FORBIDDEN, {
      code: ErrorCode.TOKEN_INVALID,
      message: 'Invalid Token',
    });
  }

  static accessDenied(): never {
    throw new AppException(HttpStatus.FORBIDDEN, {
      code: ErrorCode.ACCESS_DENIED,
      message: 'Access denied',
    });
  }

  static sessionNotFound(): never {
    throw new AppException(HttpStatus.UNAUTHORIZED, {
      code: ErrorCode.SESSION_NOT_FOUND,
      message: 'Session not found',
    });
  }

  static sessionRevorked(): never {
    throw new AppException(HttpStatus.UNAUTHORIZED, {
      code: ErrorCode.SESSION_REVOKED,
      message: 'Session revoked',
    });
  }

  static userNotFound(): never {
    throw new AppException(HttpStatus.NOT_FOUND, {
      code: ErrorCode.USER_NOT_FOUND,
      message: 'User not found',
    });
  }

  static factoryNotFound(): never {
    throw new AppException(HttpStatus.NOT_FOUND, {
      code: ErrorCode.FACTORY_NOT_FOUND,
      message: 'Factory not found',
    });
  }

  static factoryAccessDenied(): never {
    throw new AppException(HttpStatus.FORBIDDEN, {
      code: ErrorCode.FACTORY_ACCESS_DENIED,
      message: 'Factory access denied',
    });
  }

  static validateErrors(errors: ValidationError[]): unknown {
    return new AppException(HttpStatus.BAD_REQUEST, {
      code: ErrorCode.VALIDATION_ERROR,
      message: 'Validation failed',
      details: errors.map((error) => ({
        field: error.property,
        constraints: error.constraints,
      })),
    });
  }
}
