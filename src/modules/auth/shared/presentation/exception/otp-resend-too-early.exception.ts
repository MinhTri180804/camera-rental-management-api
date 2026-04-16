import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation/exceptions/domain.exception';

/**
 * Thrown when attempting to resend OTP before countdown expires.
 *
 * @param remainingMs Remaining millisecond until next allowed resend
 * @status 429 Too Many Requests
 * @errorCode OTP_RESEND_TOO_EARLY
 */
export class OtpResendTooEarlyException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Please wait before requesting a new OTP';
  static readonly ERROR_CODE = 'OTP_RESEND_TOO_EARLY';

  constructor(
    message = OtpResendTooEarlyException.DEFAULT_MESSAGE,
    remainingMs: number,
  ) {
    super(
      OtpResendTooEarlyException.ERROR_CODE,
      message,
      {
        remainingMs: remainingMs,
      },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
