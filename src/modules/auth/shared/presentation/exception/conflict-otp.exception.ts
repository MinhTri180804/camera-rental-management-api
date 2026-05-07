import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation/exceptions/domain.exception';

/**
 * Thrown when OTP is still valid and cannot be recreated.
 *
 * @status 409 Conflict
 * @errorCode OTP_NOT_EXPIRED
 */
export class ConflictOtpNoExpiredException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Conflict otp no expired';
  static readonly ERROR_CODE = 'CONFLICT_OTP_NO_EXPIRED';

  constructor(message = ConflictOtpNoExpiredException.DEFAULT_MESSAGE) {
    super(
      ConflictOtpNoExpiredException.ERROR_CODE,
      message,
      null,
      HttpStatus.CONFLICT,
    );
  }
}
