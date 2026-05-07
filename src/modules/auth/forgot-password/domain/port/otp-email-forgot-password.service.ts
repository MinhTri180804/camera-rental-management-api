import { IOtpService } from '@shared/domain/ports/otp.service';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface IOtpEmailForgotPasswordService extends IOtpService {}

export const OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN = Symbol(
  'OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN',
);
