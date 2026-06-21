import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorCode } from '../constants/errors.enum';
import { ApiErrorResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception.getStatus() || 500;
    const error = exception.getResponse();
    const code = error.code ?? ErrorCode.INTERNAL_ERROR;
    const message = error.message ?? 'Internal Server Error';
    const details = error.details;
    const now = new Date();

    response.status(status).json({
      success: false,
      requestId: request.requestId,
      timestamp: now.toISOString(),
      error: {
        code,
        message,
        details,
      },
    } as ApiErrorResponse);
  }
}
