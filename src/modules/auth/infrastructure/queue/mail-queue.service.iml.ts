import { IQueueMailService } from '@modules/auth/domain/port/mail-queue.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import {
  MAIL_QUEUE,
  MailJobType,
  VerificationEmailJobData,
} from './mail-job.types';
import { Injectable } from '@nestjs/common';

export const MAIL_QUEUE_SERVICE_TOKEN = Symbol('MAIL_QUEUE_SERVICE_TOKEN');

@Injectable()
export class MailQueueServiceIml implements IQueueMailService {
  constructor(@InjectQueue(MAIL_QUEUE) private readonly _mailQueue: Queue) {}

  async sendOTPEmailVerification(
    email: string,
    otp: string,
    expiresAt: number,
  ): Promise<void> {
    const jobData: VerificationEmailJobData = {
      email,
      otp,
      expiresAt,
    };

    await this._mailQueue.add(MailJobType.EMAIL_VERIFICATION, jobData);
  }
}
