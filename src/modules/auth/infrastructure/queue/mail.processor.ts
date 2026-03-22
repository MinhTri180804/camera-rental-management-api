/* eslint-disable no-case-declarations */
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Inject, Injectable } from '@nestjs/common';
import { render } from '@react-email/components';
import {
  MAIL_SERVICE_TOKEN,
  type IMailService,
} from '@shared/domain/ports/mail.service';
import { Job } from 'bullmq';
import { VerificationEmailTemplate } from '../mail-template/verify-email.template';
import {
  MAIL_QUEUE,
  MailJobType,
  type VerificationEmailJobData,
} from './mail-job.types';

@Injectable()
@Processor(MAIL_QUEUE)
export class MailProcessor extends WorkerHost {
  constructor(
    @Inject(MAIL_SERVICE_TOKEN) private readonly mailService: IMailService,
  ) {
    super();
  }

  async process(job: Job<VerificationEmailJobData | string>): Promise<void> {
    switch (job.name as MailJobType) {
      case MailJobType.EMAIL_VERIFICATION:
        const { email, otp, expiresAt } = job.data as VerificationEmailJobData;
        const template = await render(
          VerificationEmailTemplate({ otp, email, expiresAt }),
        );

        await this.mailService.sendMail({
          to: email,
          subject: 'Verify Email',
          template,
        });
        break;

      default:
        break;
    }
  }
}
