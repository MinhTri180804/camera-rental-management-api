import { IsEmailPattern } from '@modules/auth/shared/presentation';
import { IsNotEmpty } from 'class-validator';

export class ResendOtpForgotPasswordDTO {
  @IsEmailPattern()
  @IsNotEmpty()
  email: string;
}
