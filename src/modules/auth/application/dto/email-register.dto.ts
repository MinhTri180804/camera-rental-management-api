import { EmailValidator } from '@modules/auth/presentation/decorator/email-validator.decorator';

export class EmailRegisterDTO {
  @EmailValidator()
  email: string;
}
