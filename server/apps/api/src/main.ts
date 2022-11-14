import { NestFactory } from '@nestjs/core';
import { ApiModule } from './api.module';


async function bootstrap() {
  const app = await NestFactory.create(ApiModule);
  await app.listen(3000);
  console.log('hello api server');
  console.log(process.env.NODE_ENV);
}
bootstrap();
