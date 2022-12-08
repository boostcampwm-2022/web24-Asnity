import { NestFactory } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';
import { ApiModule } from './api.module';
import { ValidationPipe } from '@nestjs/common';
import * as Sentry from '@sentry/node';
import { SentryInterceptor } from './webhook.interceptor';
import * as cookieParser from 'cookie-parser';
import * as morgan from 'morgan';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use(morgan(':method :url :status - :response-time ms :date[iso]'));
  app.use(cookieParser());
  app.useLogger(app.get(WINSTON_MODULE_NEST_PROVIDER));
  app.useGlobalPipes(
    new ValidationPipe({
      validateCustomDecorators: true,
    }),
  );
  app.useGlobalInterceptors(new SentryInterceptor(app.get(WINSTON_MODULE_NEST_PROVIDER)));
  if (process.env.NODE_ENV == 'prod') {
    Sentry.init({
      dsn: process.env.SENTRY_DSN,
    });
    await app.listen(3001);
  } else {
    await app.listen(3000);
  }
}
bootstrap();
