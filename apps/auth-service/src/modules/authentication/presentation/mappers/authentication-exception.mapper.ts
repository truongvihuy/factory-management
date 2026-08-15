import { ForbiddenException, type HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

import { AppException } from '@/common/errors/app.exception';
import { ErrorCode } from '@/common/errors/error-code';

import { AccountInactiveError } from '../../domain/domain-errors/account-inactive.error';
import { AccountLockedError } from '../../domain/domain-errors/account-locked.error';
import { InvalidCredentialsError } from '../../domain/domain-errors/invalid-credentials.error';

export class AuthenticationExceptionMapper {
  static map(error: unknown): HttpException {
    if (error instanceof InvalidCredentialsError) {
      return new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: error.message,
      });
    }

    if (error instanceof AccountLockedError) {
      return new AppException(ErrorCode.AUTH_ACCOUNT_LOCKED, error.message, HttpStatus.LOCKED);
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
