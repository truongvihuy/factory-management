import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class RequestLoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId;

    console.log(`[${requestId}] ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        console.log(`[${requestId}] comppleted`);
      }),
    );
  }
}
