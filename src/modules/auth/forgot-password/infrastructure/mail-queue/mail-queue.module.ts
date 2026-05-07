import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import {
  MAIL_QUEUE_FORGOT_PASSWORD_NAME,
  MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
} from '../../domain';
import { MailModule, QueueModule } from '@shared/infrastructure';
import { MailQueueServiceIml } from './mail-queue.service.iml';
import { MailQueueProcessor } from './mail-queue.processor';

@Module({
  imports: [
    BullModule.registerQueue({ name: MAIL_QUEUE_FORGOT_PASSWORD_NAME }),
    QueueModule,
    MailModule,
  ],
  providers: [
    {
      provide: MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
      useClass: MailQueueServiceIml,
    },
    ...(process.env.NODE_ENV !== 'test' ? [MailQueueProcessor] : []),
  ],
  exports: [MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN],
})
export class MailQueueModule {}
