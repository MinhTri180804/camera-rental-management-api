import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class UserIdNotMatchException extends DomainException {
  static readonly ERROR_CODE = 'USER_ID_NOT_MATCH';
  static readonly ERROR_MESSAGE = 'User ID does not match';

  constructor(message = UserIdNotMatchException.ERROR_MESSAGE) {
    super(
      UserIdNotMatchException.ERROR_CODE,
      message,
      null,
      HttpStatus.BAD_REQUEST,
    );
  }
}
