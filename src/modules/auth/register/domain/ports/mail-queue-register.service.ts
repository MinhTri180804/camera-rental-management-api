export interface IMailQueueRegisterService {
  sendOTPEmailVerification({
    email,
    expiresAt,
    otp,
  }: {
    email: string;
    otp: string;
    expiresAt: number;
  }): Promise<void>;

  resendOtpEmailVerification({
    email,
    otp,
    expiresAt,
  }: {
    email: string;
    otp: string;
    expiresAt: number;
  }): Promise<void>;
}

export const MAIL_QUEUE_REGISTER_SERVICE_TOKEN = Symbol(
  'MAIL_QUEUE_REGISTER_SERVICE',
);
export const MAIL_QUEUE_REGISTER_NAME = 'mail_queue_register';
