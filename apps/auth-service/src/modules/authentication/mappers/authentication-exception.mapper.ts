import { ForbiddenException, HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

import { ErrorCode } from '@/common/errors/error-code';

import { AccountInactiveError } from '../exceptions/account-inactive.error';
import { AccountLockedError } from '../exceptions/account-locked.error';
import { InvalidCredentialsError } from '../exceptions/invalid-credentials.error';

export class AuthenticationExceptionMapper {
  static map(error: unknown): HttpException {
    if (error instanceof InvalidCredentialsError) {
      return new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: error.message,
      });
    }

    if (error instanceof AccountLockedError) {
      return new HttpException(
        {
          code: ErrorCode.AUTH_ACCOUNT_LOCKED,
          message: error.message,
        },
        HttpStatus.LOCKED,
      );
    }

    if (error instanceof AccountInactiveError) {
      return new ForbiddenException({
        code: ErrorCode.AUTH_ACCOUNT_INACTIVE,
        message: error.message,
      });
    }

    throw error;
  }
}
