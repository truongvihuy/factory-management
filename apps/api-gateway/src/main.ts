import { DEFAULT, Exceptions, HttpExceptionFilter, ResponseInterceptor } from '@libs/common';
import { TestExceptionFilter, TestGuard, TestInterceptor, TestPipe } from '@libs/common/test';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalFilters(new TestExceptionFilter());
  app.useGlobalGuards(new TestGuard());
  app.useGlobalInterceptors(new TestInterceptor());
  app.useGlobalPipes(new TestPipe());

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalInterceptors(new ResponseInterceptor());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      exceptionFactory: Exceptions.validateErrors,
    }),
  );

  await app.listen(config.get<number>('PORT', DEFAULT.PORT_API_GATEWAY));
}
bootstrap();
