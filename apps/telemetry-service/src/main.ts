import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DEFAULT } from 'libs/common';

import { AppModule } from './app.module';
import { AuthenticatedSocketAdapter } from './modules/adapter/jwt.adapter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();

  app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));

  await app.listen(config.get<number>('PORT', DEFAULT.PORT_TELEMETRY_SERVICE));
}
bootstrap();
