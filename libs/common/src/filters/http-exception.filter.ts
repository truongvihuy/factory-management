import { ArgumentsHost, Catch, ExceptionFilter } from '@nestjs/common';
import { ErrorCode } from '../constants/errors.enum';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse();

    const status = exception.status || 500;

    response.status(status).json({
      success: false,

      error: {
        code: exception.code ?? ErrorCode.INTERNAL_SERVER_ERROR,
        message: exception.message ?? 'Internal Server Error',
      },
    });
  }
}
