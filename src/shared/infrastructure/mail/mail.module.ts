import { Module } from '@nestjs/common';
import { MAIL_SERVICE_TOKEN } from '@shared/domain/ports/mail.service';
import { MailService } from './mail.service';

@Module({
  imports: [],
  providers: [
    {
      provide: MAIL_SERVICE_TOKEN,
      useClass: MailService,
    },
  ],
  exports: [MAIL_SERVICE_TOKEN],
})
export class MailModule {}
