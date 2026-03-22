import { Transporter } from 'nodemailer';

export interface SendMailOptions {
  to: string;
  subject: string;
  template: string;
}

export interface IMailService {
  mailFrom: string;
  transporter: Transporter;
  sendMail(options: SendMailOptions): Promise<void>;
}

export const MAIL_SERVICE_TOKEN = Symbol('MAIL_SERVICE');
