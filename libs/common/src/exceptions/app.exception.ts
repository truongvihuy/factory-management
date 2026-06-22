import { HttpException } from '@nestjs/common';

export interface AppExceptionPayload {
  code: string;
  message: string;
  details?: unknown;
}

export class AppException extends HttpException {
  constructor(status: number, payload: AppExceptionPayload) {
    super(payload, status);
  }
}
