import { MailConfig, mailConfigName } from '@config/mail/mail.config';
import {
  NodemailerConfig,
  nodemailerConfigName,
} from '@config/nodemailer/nodemailer.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  IMailService,
  SendMailOptions,
} from '@shared/domain/ports/mail.service';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService implements IMailService {
  readonly mailFrom: string;
  readonly transporter: Transporter;

  constructor(private readonly _configService: ConfigService) {
    const { host, password, username, port } =
      this._configService.getOrThrow<NodemailerConfig>(nodemailerConfigName);

    const { emailFrom } =
      this._configService.getOrThrow<MailConfig>(mailConfigName);

    this.mailFrom = emailFrom;

    this.transporter = nodemailer.createTransport({
      host,
      port,
      auth: {
        user: username,
        pass: password,
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    await this.transporter.sendMail({
      ...options,
      from: this.mailFrom,
      html: options.template,
    });
    return;
  }
}
