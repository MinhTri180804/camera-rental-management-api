import { IsEmailPattern } from '@modules/auth/shared/presentation/decorator/email-pattern.decorator';

export class ResendEmailVerificationOtpDTO {
  @IsEmailPattern()
  email: string;
}
