import { HttpException, type HttpStatus } from '@nestjs/common';

import type { ErrorCode } from './error-code';

export class AppException extends HttpException {
  constructor(code: ErrorCode, message: string, status: HttpStatus) {
    super(
      {
        code,
        message,
      },
      status,
    );
  }
}
