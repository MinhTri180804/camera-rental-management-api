import { IsEmailPattern } from '@modules/auth/shared/presentation/decorator/email-pattern.decorator';
import { IsOtpPattern } from '@modules/auth/shared/presentation/decorator/otp-validator.decorator';
import { IsPasswordPattern } from '@modules/auth/shared/presentation/decorator/password-pattern-validator.decorator';

export class VerifyEmailVerificationOtpDTO {
  @IsEmailPattern()
  email: string;

  @IsOtpPattern()
  otp: string;

  @IsPasswordPattern()
  password: string;
}
