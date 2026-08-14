import { ForbiddenException, type HttpException, HttpStatus, UnauthorizedException } from '@nestjs/common';

import { AppException } from '@/common/errors/app.exception';
import { ErrorCode } from '@/common/errors/error-code';

import { AccountInactiveDomainError } from '../domain/exceptions/account-inactive.domain-error';
import { AccountLockedDomainError } from '../domain/exceptions/account-locked.domain-error';
import { InvalidCredentialsDomainError } from '../domain/exceptions/invalid-credentials.domain-error';

export class AuthenticationExceptionMapper {
  static map(error: unknown): HttpException {
    if (error instanceof InvalidCredentialsDomainError) {
      return new UnauthorizedException({
        code: ErrorCode.AUTH_INVALID_CREDENTIALS,
        message: error.message,
      });
    }

    if (error instanceof AccountLockedDomainError) {
      return new AppException(ErrorCode.AUTH_ACCOUNT_LOCKED, error.message, HttpStatus.LOCKED);
    }

    if (error instanceof AccountInactiveDomainError) {
      return new ForbiddenException({
        code: ErrorCode.AUTH_ACCOUNT_INACTIVE,
        message: error.message,
      });
    }

    throw error;
  }
}
