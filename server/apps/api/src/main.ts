import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from '../../webhook.interceptor';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  if (process.env.NODE_ENV == 'prod') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });
    app.useGlobalInterceptors(new SentryInterceptor());
  }
  app.use(cookieParser());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3000);
}
bootstrap();
