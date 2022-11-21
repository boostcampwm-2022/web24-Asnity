import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { IncomingWebhook } from '@slack/webhook';
import { of } from 'rxjs';
import * as Sentry from '@sentry/minimal';
import * as ip from 'ip';

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  // TODO: logger로 error logging interceptor에서 하도록 refactoring
  intercept(_: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
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
        return of(error.response ?? error);
      }),
    );
  }
}
