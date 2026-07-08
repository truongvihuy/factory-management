import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Observable, tap } from 'rxjs';

export class TestInterceptor implements NestInterceptor {
  constructor() {
    console.log('TestInterceptor created');
  }
  intercept(context: ExecutionContext, next: CallHandler<unknown>): Observable<unknown> | Promise<Observable<unknown>> {
    console.log('TestInterceptor.intercept');
    return next.handle().pipe(
      tap(() => {
        console.log('TestInterceptor.intercept.tap');
      }),
    );
  }
}
