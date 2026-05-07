import { Queue } from 'bullmq';
import {
  IMailQueueForgotPasswordService,
  MAIL_QUEUE_FORGOT_PASSWORD_NAME,
} from '../../domain';
import { JOB_NAME } from './job-name.constants';
import { type SendOTPEmailForgotPasswordJobData } from './job-data.type';
import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';

@Injectable()
export class MailQueueServiceIml implements IMailQueueForgotPasswordService {
  constructor(
    @InjectQueue(MAIL_QUEUE_FORGOT_PASSWORD_NAME)
    private readonly _queue: Queue,
  ) {}

  async sendOTPEmailForgotPassword({
    email,
    otp,
    expiresAt,
  }: {
    email: string;
    otp: string;
    expiresAt: number;
  }): Promise<void> {
    const jobData: SendOTPEmailForgotPasswordJobData = {
      email,
      otp,
      expiresAt,
    };

    await this._queue.add(JOB_NAME.SEND_OTP_EMAIL_FORGOT_PASSWORD, jobData);
    return;
  }

  async resendOTPEmailForgotPassword({
    email,
    otp,
    expiresAt,
  }: {
    email: string;
    otp: string;
    expiresAt: number;
  }): Promise<void> {
    const jobData: SendOTPEmailForgotPasswordJobData = {
      email,
      otp,
      expiresAt,
    };

    await this._queue.add(JOB_NAME.RESEND_OTP_EMAIL_FORGOT_PASSWORD, jobData);
    return;
  }
}
