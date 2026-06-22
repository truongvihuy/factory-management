import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { ErrorCode } from '../constants/errors.enum';
import { AppException } from '../exceptions/app.exception';
import { ApiErrorResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter<AppException> {
  catch(exception: AppException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();

    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception.getStatus ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
    const error = exception.getResponse && (exception.getResponse() as any);
    const code = error?.code ?? ErrorCode.INTERNAL_ERROR;
    const message = error?.message ?? 'Internal Server Error';
    const details = error?.details;
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
