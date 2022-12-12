import { RedisModule } from '@liaoliaots/nestjs-redis';

export const importRedisModule = () =>
  RedisModule.forRoot({
    config: {
      host: 'localhost',
      port: Number(process.env.REDIS_PORT),
      password: process.env.REDIS_PASSWORD,
    },
  });
