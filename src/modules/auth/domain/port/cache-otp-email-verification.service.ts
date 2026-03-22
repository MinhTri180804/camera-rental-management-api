export interface ICacheOtpEmailVerificationService {
  get expiresTimeSeconds(): number;
  get countdownSeconds(): number;

  getKey(email: string): string;
  set(email: string, otp: string): Promise<void>;
  get(email: string): Promise<string | null>;
  delete(email: string): Promise<void>;
  getCountdown(email: string): Promise<{
    status: CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS;
    countdown: number | null;
  }>;
  isExist(email: string): Promise<boolean>;
}

export enum CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS {
  OK = 'OK',
  NOT_FOUND = 'NOT_FOUND',
  NO_EXPIRE = 'NO_EXPIRE',
}

export const CACHE_OTP_EMAIL_VERIFICATION_SERVICE = Symbol(
  'CACHE_OTP_EMAIL_VERIFICATION_SERVICE',
);
