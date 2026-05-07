import { IsEmailPattern } from '@modules/auth/shared/presentation/decorator/email-pattern.decorator';

export class SendEmailVerificationOtpDTO {
  @IsEmailPattern()
  email: string;
}
