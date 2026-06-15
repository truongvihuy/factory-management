import {
  ExecutionTimeInterceptor,
  HttpExceptionFilter,
  RequestLoggerInterceptor,
  ResponseInterceptor,
} from '@libs/common';
import { TestExceptionFilter, TestGuard, TestInterceptor, TestPipe } from '@libs/common/test';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new RequestLoggerInterceptor());
  app.useGlobalInterceptors(new ExecutionTimeInterceptor());
  app.useGlobalInterceptors(new ResponseInterceptor());

  app.useGlobalFilters(new TestExceptionFilter());
  app.useGlobalGuards(new TestGuard());
  app.useGlobalInterceptors(new TestInterceptor());
  app.useGlobalPipes(new TestPipe());

  await app.listen(config.get<number>('PORT') ?? 3000);
}
bootstrap();
