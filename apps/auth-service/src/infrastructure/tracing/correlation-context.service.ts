import { Injectable } from '@nestjs/common';
import { AsyncLocalStorage } from 'node:async_hooks';

export interface CorrelationContext {
  requestId: string;
  traceId?: string;
}

@Injectable()
export class CorrelationContextService {
  private readonly storage = new AsyncLocalStorage<CorrelationContext>();

  run<T>(context: CorrelationContext, callback: () => T): T {
    return this.storage.run(context, callback);
  }

  get(): CorrelationContext | undefined {
    return this.storage.getStore();
  }

  getRequestId(): string | undefined {
    return this.storage.getStore()?.requestId;
  }

  getTraceId(): string | undefined {
    return this.storage.getStore()?.traceId;
  }
}
