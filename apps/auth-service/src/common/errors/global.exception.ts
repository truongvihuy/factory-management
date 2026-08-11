import { Catch, HttpException, type ArgumentsHost, type ExceptionFilter } from '@nestjs/common';
import { ErrorCode } from './error-code';

interface HttpExceptionResponse {
  code?: string;
  message?: string;
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();

    const response = context.getResponse();
    const request = context.getRequest();

    const status = exception instanceof HttpException ? exception.getStatus() : 500;
    const exceptionResponse = exception instanceof HttpException ? exception.getResponse() : null;
    const responseBody: HttpExceptionResponse =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? (exceptionResponse as HttpExceptionResponse)
        : {};

    response.status(status).json({
      statusCode: status,
      code:
        typeof responseBody.code === 'string'
          ? responseBody.code
          : exception instanceof HttpException
            ? ErrorCode.HTTP_ERROR
            : ErrorCode.INTERNAL_ERROR,
      message:
        typeof responseBody.message === 'string'
          ? responseBody.message
          : exception instanceof Error
            ? exception.message
            : 'Internal server error',
      timestamp: new Date().toISOString(),
      path: request.url,
    });
  }
}
