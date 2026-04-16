import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation/exceptions/domain.exception';

export class EmailOrPasswordInvalidException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Email or password invalid';
  static readonly ERROR_CODE = 'EMAIL_OR_PASSWORD_INVALID';
  constructor(message = EmailOrPasswordInvalidException.DEFAULT_MESSAGE) {
    super(
      EmailOrPasswordInvalidException.ERROR_CODE,
      message,
      {
        email: 'Email invalid',
        password: 'Password invalid',
      },
      HttpStatus.UNAUTHORIZED,
    );
  }
}
