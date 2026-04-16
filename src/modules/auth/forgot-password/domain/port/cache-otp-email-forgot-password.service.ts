export interface ICacheOtpEmailForgotPasswordService {
  get expiresTimeSeconds(): number;
  get countdownSeconds(): number;
  get prefix(): string;
  get countdownPrefix(): string;

  getKey(email: string): string;
  set(
    email: string,
    otp: string,
  ): Promise<{
    expiresAt: number;
    resendAvailableAt: number;
  }>;
  get(email: string): Promise<string | null>;
  delete(email: string): Promise<void>;
  getCountdown(email: string): Promise<{
    status: CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS;
    countdown: number | null;
  }>;
  isExist(email: string): Promise<boolean>;
}

export enum CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS {
  WAIT = 'WAIT',
  CAN_RESEND = 'CAN_RESEND',
}

export const CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN = Symbol(
  'CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE',
);
