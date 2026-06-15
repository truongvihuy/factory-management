import { ExecutionTimeInterceptor } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.useGlobalInterceptors(new ExecutionTimeInterceptor());
  await app.listen(config.get<number>('PORT') ?? 3003);
}
bootstrap();
