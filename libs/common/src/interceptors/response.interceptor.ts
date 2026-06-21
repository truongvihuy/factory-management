import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    const request = context.switchToHttp().getRequest();
    const now = new Date();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        requestId: request.requestId,
        timestamp: now.toISOString(),
        excutionTime: +now - +request.startTime,
        data,
      })),
    );
  }
}
