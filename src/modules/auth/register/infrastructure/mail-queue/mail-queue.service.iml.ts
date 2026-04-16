import { Injectable } from '@nestjs/common';
import {
  type IMailQueueRegisterService,
  MAIL_QUEUE_REGISTER_NAME,
} from '../../domain';
import { Queue } from 'bullmq';
import { InjectQueue } from '@nestjs/bullmq';
import { SendOTPEmailVerificationJobData } from './job-data.type';
import { JOB_NAME } from './job-name.constants';

@Injectable()
export class MailQueueServiceIml implements IMailQueueRegisterService {
  constructor(
    @InjectQueue(MAIL_QUEUE_REGISTER_NAME) private readonly _queue: Queue,
  ) {}

  async sendOTPEmailVerification({
    email,
    expiresAt,
    otp,
  }: {
    email: string;
    otp: string;
    expiresAt: number;
  }): Promise<void> {
    const jobData: SendOTPEmailVerificationJobData = {
      otp,
      email,
      expiresAt,
    };

    await this._queue.add(JOB_NAME.SEND_OTP_EMAIL_VERIFICATION, jobData);
  }

  async resendOtpEmailVerification({
    email,
    expiresAt,
    otp,
  }: {
    email: string;
    otp: string;
    expiresAt: number;
  }): Promise<void> {
    const jobData: SendOTPEmailVerificationJobData = {
      otp,
      email,
      expiresAt,
    };

    await this._queue.add(JOB_NAME.RESEND_OTP_EMAIL_VERIFICATION, jobData);
  }
}
