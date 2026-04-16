export interface IMailQueueForgotPasswordService {
  sendOTPEmailForgotPassword({
    otp,
    email,
    expiresAt,
  }: {
    otp: string;
    email: string;
    expiresAt: number;
  }): Promise<void>;

  resendOTPEmailForgotPassword({
    otp,
    email,
    expiresAt,
  }: {
    otp: string;
    email: string;
    expiresAt: number;
  }): Promise<void>;
}

export const MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN = Symbol(
  'MAIL_QUEUE_FORGOT_PASSWORD_SERVICE',
);
export const MAIL_QUEUE_FORGOT_PASSWORD_NAME = 'mail_queue_forgot-password';
