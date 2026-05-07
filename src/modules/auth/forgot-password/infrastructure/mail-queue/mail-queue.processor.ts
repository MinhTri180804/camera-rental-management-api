import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { JOB_NAME, JobName } from './job-name.constants';
import { MAIL_QUEUE_FORGOT_PASSWORD_NAME } from '../../domain';
import { Inject, Injectable } from '@nestjs/common';
import { MAIL_SERVICE_TOKEN, type IMailService } from '@shared/domain';
import {
  ResendOTPEmailForgotPasswordJobData,
  SendOTPEmailForgotPasswordJobData,
} from './job-data.type';
import { render } from '@react-email/components';
import { SendEmailForgotPasswordOtpTemplate } from '@modules/auth/shared/infrastructure/mail-template/send-email-forgot-password-otp.template';
import { ResendEmailForgotPasswordOtpTemplate } from '@modules/auth/shared/infrastructure/mail-template/resend-email-forgot-password-otp.template';

@Injectable()
@Processor(MAIL_QUEUE_FORGOT_PASSWORD_NAME)
export class MailQueueProcessor extends WorkerHost {
  constructor(
    @Inject(MAIL_SERVICE_TOKEN) private readonly _mailService: IMailService,
  ) {
    super();
  }

  async process(
    job: Job<
      SendOTPEmailForgotPasswordJobData | ResendOTPEmailForgotPasswordJobData
    >,
  ): Promise<void> {
    switch (job.name as JobName) {
      case JOB_NAME.SEND_OTP_EMAIL_FORGOT_PASSWORD:
        {
          const { otp, email, expiresAt } =
            job.data as SendOTPEmailForgotPasswordJobData;

          const template = await render(
            SendEmailForgotPasswordOtpTemplate({ otp, email, expiresAt }),
          );

          await this._mailService.sendMail({
            template,
            to: email,
            subject: 'Send Email Forgot Password',
          });
        }
        break;

      case JOB_NAME.RESEND_OTP_EMAIL_FORGOT_PASSWORD:
        {
          const { otp, email, expiresAt } =
            job.data as ResendOTPEmailForgotPasswordJobData;
          const template = await render(
            ResendEmailForgotPasswordOtpTemplate({ otp, email, expiresAt }),
          );

          await this._mailService.sendMail({
            template,
            to: email,
            subject: 'Send Email Forgot Password',
          });
        }
        break;

      default:
        throw new Error(`${job.name} is not exist or not defined`);
        break;
    }
  }
}
