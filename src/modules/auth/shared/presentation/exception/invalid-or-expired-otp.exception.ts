import { DomainException } from '@shared/presentation/exceptions/domain.exception';

/**
 * Thrown when OTP is invalid or expired.
 *
 * @status 400 Bad Request
 * @errorCode INVALID_OR_EXPIRED_OTP
 */

export class InvalidOrExpiredOtpException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Invalid or expired OTP';
  static readonly ERROR_CODE = 'INVALID_OR_EXPIRED_OTP';
  constructor(message = InvalidOrExpiredOtpException.DEFAULT_MESSAGE) {
    super(InvalidOrExpiredOtpException.ERROR_CODE, message, null, 400);
  }
}
