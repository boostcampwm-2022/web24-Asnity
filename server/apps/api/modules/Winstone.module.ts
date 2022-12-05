import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';
import { utilities as nestWinstonModuleUtilities } from 'nest-winston/dist/winston.utilities';

export const importWinstonModule = () =>
  WinstonModule.forRoot({
    transports: [
      new winston.transports.Console({
        level: process.env.NODE_ENV === 'prod' ? 'info' : 'silly',
        format: winston.format.combine(
          winston.format.colorize({ all: true }),
          winston.format.simple(),
          winston.format.timestamp(),
          nestWinstonModuleUtilities.format.nestLike('Asnity', { prettyPrint: true }),
        ),
      }),
    ],
  });
