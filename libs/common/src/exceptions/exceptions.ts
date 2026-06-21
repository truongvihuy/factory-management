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

  static userNotFound(): never {
    throw new AppException(HttpStatus.NOT_FOUND, {
      code: ErrorCode.USER_NOT_FOUND,
      message: 'User not found',
    });
  }

  static factoryNotFound(): never {
    throw new AppException(HttpStatus.NOT_FOUND, {
      code: ErrorCode.FACTORY_NOT_FOUND,
      message: 'User not found',
    });
  }

  static accessDenied(): never {
    throw new AppException(HttpStatus.FORBIDDEN, {
      code: ErrorCode.ACCESS_DENIED,
      message: 'Access denied',
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
