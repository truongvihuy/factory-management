import { DEFAULT } from '@libs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors();

  // app.useWebSocketAdapter(new AuthenticatedSocketAdapter(app));

  await app.listen(config.get<number>('PORT', DEFAULT.PORT_TELEMETRY_SERVICE));
}
bootstrap();
