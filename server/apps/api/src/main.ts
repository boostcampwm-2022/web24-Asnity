import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';
import * as dotenv from 'dotenv';

async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  await app.listen(3000);
  console.log(dotenv);
}
bootstrap();
