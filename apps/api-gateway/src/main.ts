import { DEFAULT, Exceptions, HttpExceptionFilter, ResponseInterceptor } from '@libs/common';
import { TestExceptionFilter, TestGuard, TestInterceptor, TestPipe } from '@libs/common/test';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.setGlobalPrefix('api');

  const builder = new DocumentBuilder()
    .setTitle('Factory Management API')
    .setDescription('Factory Management System')
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'access-token',
    )
    .addBasicAuth(
      {
        type: 'http',
        scheme: 'basic',
        in: 'header',
      },
      'basic-token',
    )
    .build();

  const document = SwaggerModule.createDocument(app, builder);
  SwaggerModule.setup('docs', app, document, {
    jsonDocumentUrl: 'swagger/json',
  });

  app.useGlobalFilters(new TestExceptionFilter());
  app.useGlobalGuards(new TestGuard());
  app.useGlobalInterceptors(new TestInterceptor());
  app.useGlobalPipes(new TestPipe());

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
