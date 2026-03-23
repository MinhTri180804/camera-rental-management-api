import { IsEmailValidator } from '@modules/auth/presentation/decorator/email-validator.decorator';

export class SendEmailVerificationOtpDTO {
  @IsEmailValidator()
  email: string;
}
