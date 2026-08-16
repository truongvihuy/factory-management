import { Global, Module } from '@nestjs/common';

import { TracingModule } from '@/infrastructure/tracing/tracing.module';

import { AppLoggerService } from './app-logger.service';

@Global()
@Module({
  imports: [TracingModule],
  providers: [AppLoggerService],
  exports: [AppLoggerService],
})
export class LoggerModule {}
