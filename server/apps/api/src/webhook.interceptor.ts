import {
  CallHandler,
  ExecutionContext,
  Inject,
  Injectable,
  LoggerService,
  NestInterceptor,
} from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { IncomingWebhook } from '@slack/webhook';
import { of } from 'rxjs';
import * as Sentry from '@sentry/minimal';
import * as ip from 'ip';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  constructor(@Inject(WINSTON_MODULE_NEST_PROVIDER) private readonly logger: LoggerService) {}

  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        this.logger.error(error.response ?? error);
        Sentry.captureException(error);
        if (process.env.NODE_ENV == 'prod') {
          const webhook = new IncomingWebhook(process.env.ERROR_SLACK_WEBHOOK);
          webhook.send({
            attachments: [
              {
                color: 'danger',
                text: '🚨asnity-server 에러 발생🚨',
                fields: [
                  {
                    title: error.message,
                    value: `Server IP : ${ip.address()}\n` + error.stack,
                    short: false,
                  },
                ],
                ts: Math.floor(new Date().getTime() / 1000).toString(),
              },
            ],
          });
        }
        return of(error.response ?? error);
      }),
    );
  }
}
