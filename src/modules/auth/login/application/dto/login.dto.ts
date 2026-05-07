import {
  IsEmailPattern,
  IsPasswordPattern,
} from '@modules/auth/shared/presentation';
import { IsNotEmpty } from 'class-validator';

export class LoginDTO {
  @IsNotEmpty()
  @IsEmailPattern()
  email: string;

  @IsNotEmpty()
  @IsPasswordPattern()
  password: string;
}
