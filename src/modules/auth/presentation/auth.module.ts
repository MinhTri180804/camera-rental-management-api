import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailModule } from '@shared/infrastructure/mail/mail.module';
import { UserSchemaModel } from '@shared/infrastructure/persistence/schema/user.schema';
import { QueueModule } from '@shared/infrastructure/queue/queue.module';
import { EmailVerificationUseCase } from '../application/use-case/email-verification.usecase';
import { CACHE_OTP_EMAIL_VERIFICATION_SERVICE } from '../domain/port/cache-otp-email-verification.service';
import { OTP_EMAIL_VERIFICATION_SERVICE_TOKEN } from '../domain/port/otp-email-verification.service';
import { USER_REPOSITORY_TOKEN } from '../domain/port/user.repository';
import { CacheOTPVerificationServiceImpl } from '../infrastructure/cache-otp-verification/cache-otp-verification.service.iml';
import { OtpEmailVerificationServiceImpl } from '../infrastructure/otp-email-verification/otp-email-verification.service.iml';
import { UserRepositoryImpl } from '../infrastructure/persistence/user.repository.iml';
import { MAIL_QUEUE } from '../infrastructure/queue/mail-job.types';
import {
  MAIL_QUEUE_SERVICE_TOKEN,
  MailQueueServiceIml,
} from '../infrastructure/queue/mail-queue.service.iml';
import { MailProcessor } from '../infrastructure/queue/mail.processor';
import { AuthController } from './auth.controller';
import { CacheModule } from '@shared/infrastructure/cache/cache.module';

@Module({
  imports: [
    MongooseModule.forFeature([UserSchemaModel]),
    QueueModule,
    BullModule.registerQueue({
      name: MAIL_QUEUE,
    }),
    MailModule,
    CacheModule,
  ],
  providers: [
    MailProcessor,
    EmailVerificationUseCase,
    {
      provide: MAIL_QUEUE_SERVICE_TOKEN,
      useClass: MailQueueServiceIml,
    },
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
      useClass: OtpEmailVerificationServiceImpl,
    },
    {
      provide: CACHE_OTP_EMAIL_VERIFICATION_SERVICE,
      useClass: CacheOTPVerificationServiceImpl,
    },
  ],
  exports: [],
  controllers: [AuthController],
})
export class AuthModule {}
