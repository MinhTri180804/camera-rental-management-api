import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullMQFactory } from './bullMQ/bullMQ.factory';

@Module({
  imports: [
    BullModule.forRootAsync({
      useClass: BullMQFactory,
    }),
  ],
  providers: [],
  exports: [],
})
export class QueueModule {}
