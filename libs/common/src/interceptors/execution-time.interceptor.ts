import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class ExecutionTimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const requestId = request.requestId;
    const startTime = request.startTime;

    return next.handle().pipe(
      tap(() => {
        const ms = Date.now() - startTime;
        console.log(`[${requestId}] execution time ${ms}ms`);
      }),
    );
  }
}
