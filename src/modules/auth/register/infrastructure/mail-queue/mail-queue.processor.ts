import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { MAIL_QUEUE_REGISTER_NAME } from '../../domain';
import { Inject, Injectable } from '@nestjs/common';
import { type IMailService, MAIL_SERVICE_TOKEN } from '@shared/domain';
import {
  ResendOTPEmailVerificationJobData,
  SendOTPEmailVerificationJobData,
} from './job-data.type';
import { JOB_NAME, JobName } from './job-name.constants';
import { render } from '@react-email/components';
import { VerificationEmailTemplate } from '@modules/auth/shared/infrastructure/mail-template/verify-email.template';
import { ResendEmailVerificationOtpTemplate } from '@modules/auth/shared/infrastructure/mail-template/resend-email-verification-otp.template';

@Injectable()
@Processor(MAIL_QUEUE_REGISTER_NAME)
export class MailQueueProcessor extends WorkerHost {
  constructor(
    @Inject(MAIL_SERVICE_TOKEN) private readonly _mailService: IMailService,
  ) {
    super();
  }

  async process(
    job: Job<
      SendOTPEmailVerificationJobData | ResendOTPEmailVerificationJobData
    >,
  ): Promise<void> {
    switch (job.name as JobName) {
      case JOB_NAME.SEND_OTP_EMAIL_VERIFICATION:
        {
          const { otp, email, expiresAt } =
            job.data as SendOTPEmailVerificationJobData;

          const template = await render(
            VerificationEmailTemplate({ otp, email, expiresAt }),
          );

          await this._mailService.sendMail({
            to: email,
            template,
            subject: 'Verify Email Register',
          });
        }
        break;

      case JOB_NAME.RESEND_OTP_EMAIL_VERIFICATION:
        {
          const { otp, email, expiresAt } =
            job.data as ResendOTPEmailVerificationJobData;

          const template = await render(
            ResendEmailVerificationOtpTemplate({ otp, email, expiresAt }),
          );

          await this._mailService.sendMail({
            to: email,
            template,
            subject: 'Resend Verify Email Register',
          });
        }
        break;

      default:
        throw new Error(`${job.name} not found or not defined`);
        break;
    }
  }
}
