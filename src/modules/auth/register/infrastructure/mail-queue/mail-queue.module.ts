import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { BullBoardModule } from '@bull-board/nestjs';
import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MailModule, QueueModule } from '@shared/infrastructure';
import {
  MAIL_QUEUE_REGISTER_NAME,
  MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
} from '../../domain';
import { MailQueueProcessor } from './mail-queue.processor';
import { MailQueueServiceIml } from './mail-queue.service.iml';

@Module({
  imports: [
    BullModule.registerQueue({ name: MAIL_QUEUE_REGISTER_NAME }),
    BullBoardModule.forFeature({
      name: MAIL_QUEUE_REGISTER_NAME,
      adapter: BullMQAdapter,
    }),
    QueueModule,
    MailModule,
  ],
  providers: [
    {
      provide: MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
      useClass: MailQueueServiceIml,
    },
    ...(process.env.NODE_ENV !== 'test' ? [MailQueueProcessor] : []),
  ],
  exports: [MAIL_QUEUE_REGISTER_SERVICE_TOKEN],
})
export class MailQueueRegisterModule {}
