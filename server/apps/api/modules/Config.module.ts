import { ConfigModule } from '@nestjs/config';

export const importConfigModule = () =>
  ConfigModule.forRoot({
    isGlobal: true,
    envFilePath: `config/${process.env.NODE_ENV}.env`,
  });
