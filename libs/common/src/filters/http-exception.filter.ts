import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorCode } from '../constants/errors.enum';
import { ApiErrorResponse } from '../interfaces/response.interface';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();

    const status = exception.status || 500;
    const now = new Date();

    response.status(status).json({
      success: false,
      requestId: request.requestId,
      timestamp: now.toISOString(),
      error: {
        code: exception.code ?? ErrorCode.INTERNAL_SERVER_ERROR,
        message: exception.message ?? 'Internal Server Error',
      },
    } as ApiErrorResponse);
  }
}
