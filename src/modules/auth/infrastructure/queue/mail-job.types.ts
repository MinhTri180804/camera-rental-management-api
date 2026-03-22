export enum MailJobType {
  EMAIL_VERIFICATION = 'EMAIL_VERIFICATION',
}

export interface VerificationEmailJobData {
  email: string;
  otp: string;
  expiresAt: number;
}

export const MAIL_QUEUE = 'MAIL_QUEUE';
