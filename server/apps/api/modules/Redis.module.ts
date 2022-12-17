import { RedisModule } from '@liaoliaots/nestjs-redis';

export const importRedisModule = () =>
  RedisModule.forRoot({
    config: {
      host: process.env.NODE_ENV == 'prod' ? 'cache-redis' : 'localhost',
      port: 6379,
    },
  });
