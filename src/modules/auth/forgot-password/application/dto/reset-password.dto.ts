import {
  IsEmailPattern,
  IsOtpPattern,
  IsPasswordPattern,
} from '@modules/auth/shared/presentation';
import { IsNotEmpty } from 'class-validator';

export class ResetPasswordDTO {
  @IsNotEmpty()
  @IsEmailPattern()
  email: string;

  @IsNotEmpty()
  @IsOtpPattern()
  otp: string;

  @IsPasswordPattern()
  @IsNotEmpty()
  password: string;
}
