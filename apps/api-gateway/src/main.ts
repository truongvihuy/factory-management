import {
  ExecutionTimeInterceptor,
  HttpExceptionFilter,
  RequestLoggerInterceptor,
  ResponseInterceptor,
} from '@libs/common';
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
  await app.listen(config.get<number>('PORT') ?? 3000);
}
bootstrap();
