import { Module } from '@nestjs/common';
import { LoggerModule } from './common/logger/logger.module';
import { AppConfigModule } from './config/config.module';
import { HealthModule } from './health/health.module';

@Module({
  imports: [AppConfigModule, LoggerModule, HealthModule],
})
export class AppModule {}
