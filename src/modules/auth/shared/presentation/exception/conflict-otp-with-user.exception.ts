import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation/exceptions/domain.exception';

export class ConflictOtpWithUserException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Conflict otp with user';
  static readonly ERROR_CODE = 'CONFLICT_OTP_WITH_USER';

  constructor(message = ConflictOtpWithUserException.DEFAULT_MESSAGE) {
    super(
      ConflictOtpWithUserException.ERROR_CODE,
      message,
      null,
      HttpStatus.CONFLICT,
    );
  }
}
