import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from '../../webhook.interceptor';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableCors();
  if (process.env.NODE_ENV == 'prod') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });
    app.useGlobalInterceptors(new SentryInterceptor());
  }
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
