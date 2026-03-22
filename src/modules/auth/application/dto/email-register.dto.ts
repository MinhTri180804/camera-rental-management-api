import { EmailValidator } from '@modules/auth/presentation/decorator/email-validator.decorator';

export class SendEmailVerificationOtpDTO {
  @EmailValidator()
  email: string;
}
