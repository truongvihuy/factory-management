import { Injectable, type NestMiddleware } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';
import { randomUUID } from 'node:crypto';

import { REQUEST_ID_HEADER, TRACE_ID_HEADER } from '../constants/correlation.constant';
import type { CorrelationContextService } from './correlation-context.service';

@Injectable()
export class CorrelationMiddleware implements NestMiddleware {
  constructor(private readonly correlationContext: CorrelationContextService) {}

  use(request: Request, response: Response, next: NextFunction): void {
    const requestId = this.getOrCreateRequestId(request);

    const traceId = this.getTraceId(request);

    response.setHeader(REQUEST_ID_HEADER, requestId);

    if (traceId !== undefined) {
      response.setHeader(TRACE_ID_HEADER, traceId);
    }

    this.correlationContext.run(
      {
        requestId,
        ...(traceId !== undefined ? { traceId } : {}),
      },
      () => {
        next();
      },
    );
  }

  private getOrCreateRequestId(request: Request): string {
    const requestId = request.header(REQUEST_ID_HEADER);

    if (requestId !== undefined && requestId.length > 0) {
      return requestId;
    }

    return randomUUID();
  }

  private getTraceId(request: Request): string | undefined {
    const traceId = request.header(TRACE_ID_HEADER);

    if (traceId === undefined || traceId.length === 0) {
      return undefined;
    }

    return traceId;
  }
}
