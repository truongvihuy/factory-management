import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggerInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId;
    const startTime = new Date();

    console.log(`[${requestId}] ${request.method} ${request.url}`);

    return next.handle().pipe(
      tap(() => {
        const now = new Date();
        const ms = +now - +startTime;
        console.log(`[${requestId}] completed, ${ms}ms`);
      }),
    );
  }
}
