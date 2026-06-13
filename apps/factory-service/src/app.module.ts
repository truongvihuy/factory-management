import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

@Module({
  imports: [],
})
export class TemModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {}
}
