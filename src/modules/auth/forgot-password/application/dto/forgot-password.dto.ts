import { IsEmailPattern } from '@modules/auth/shared/presentation';
import { IsNotEmpty } from 'class-validator';

export class ForgotPasswordDTO {
  @IsEmailPattern()
  @IsNotEmpty()
  email: string;
}
