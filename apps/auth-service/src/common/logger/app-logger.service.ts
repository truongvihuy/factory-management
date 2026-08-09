import { Injectable, type LoggerService } from '@nestjs/common';
import type { ConfigService } from '@nestjs/config';
import type { CorrelationContextService } from '../tracing/correlation-context.service';

interface LogContext {
  service: string;
  environment: string;
  requestId?: string;
  traceId?: string;
  context?: string;
  metadata?: Record<string, unknown>;
}

@Injectable()
export class AppLoggerService implements LoggerService {
  constructor(
    private readonly configService: ConfigService,
    private readonly correlationContextService: CorrelationContextService,
  ) {}

  private get service(): string {
    return this.configService.getOrThrow<string>('app.name');
  }

  private get environment(): string {
    return this.configService.getOrThrow<string>('app.environment');
  }

  log(message: unknown, context?: string): void {
    this.write('info', message, this.buildContext(context));
  }

  info(message: unknown, context?: string): void {
    this.write('info', message, this.buildContext(context));
  }

  warn(message: unknown, context?: string): void {
    this.write('warn', message, this.buildContext(context));
  }

  error(message: unknown, stackOrContext?: string, context?: string): void {
    const isStack = this.looksLikeStackTrace(stackOrContext);

    const logContext: Partial<LogContext> = {};
    if (context !== undefined) {
      logContext.context = context;
    } else if (stackOrContext !== undefined && !isStack) {
      logContext.context = stackOrContext;
    }

    if (isStack && stackOrContext !== undefined) {
      logContext.metadata = {
        stack: stackOrContext,
      };
    }

    this.write('error', message, logContext);
  }

  debug(message: unknown, context?: string): void {
    if (this.environment === 'production') {
      return;
    }

    this.write('debug', message, this.buildContext(context));
  }

  verbose(message: unknown, context?: string): void {
    if (this.environment === 'production') {
      return;
    }

    this.write('verbose', message, this.buildContext(context));
  }

  private buildContext(context?: string): Partial<LogContext> | undefined {
    if (context === undefined) {
      return undefined;
    }

    return {
      context,
    };
  }

  private write(
    level: 'debug' | 'info' | 'warn' | 'error' | 'verbose',
    message: unknown,
    context?: Partial<LogContext>,
  ): void {
    const correlationContext = this.correlationContextService.get();
    const entry = {
      timestamp: new Date().toISOString(),
      level,
      service: this.service,
      environment: this.environment,
      message: this.serializeMessage(message),
      ...(correlationContext?.requestId !== undefined && { requestId: correlationContext.requestId }),
      ...(correlationContext?.traceId !== undefined && { traceId: correlationContext.traceId }),
      ...context,
    };

    const output = JSON.stringify(this.sanitize(entry));

    if (level === 'error') {
      process.stderr.write(`${output}\n`);
      return;
    }

    process.stdout.write(`${output}\n`);
  }

  private serializeMessage(message: unknown): string {
    if (typeof message === 'string') {
      return message;
    }

    try {
      return JSON.stringify(message);
    } catch {
      return String(message);
    }
  }

  private looksLikeStackTrace(value?: string): boolean {
    if (!value) {
      return false;
    }

    return value.includes('\n') || value.includes('Error:') || value.includes('    at ');
  }

  private sanitize<T>(value: T): T {
    return value;
  }
}
