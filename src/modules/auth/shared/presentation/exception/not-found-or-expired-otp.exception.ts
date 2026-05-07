import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation/exceptions/domain.exception';

/**
 * Thrown when OTP does not exist or has expired.
 *
 * @status 404 Not Found
 * @errorCode OTP_NOT_FOUND_OR_EXPIRED
 */
export class NotfoundOrExpiredOtpException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'OTP not found or expired';
  static readonly ERROR_CODE = 'OTP_NOT_FOUND_OR_EXPIRED';

  constructor(message = NotfoundOrExpiredOtpException.DEFAULT_MESSAGE) {
    super(
      NotfoundOrExpiredOtpException.ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
