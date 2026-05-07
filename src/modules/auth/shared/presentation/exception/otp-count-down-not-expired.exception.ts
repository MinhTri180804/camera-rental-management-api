import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation/exceptions/domain.exception';

export class OtpCountDownNotExpiredException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Please wait before requesting another OTP';
  static readonly ERROR_CODE = 'OTP_COUNT_DOWN_NOT_EXPIRED';

  constructor(
    countdown: number,
    message = OtpCountDownNotExpiredException.DEFAULT_MESSAGE,
  ) {
    super(
      OtpCountDownNotExpiredException.ERROR_CODE,
      message,
      { countdown },
      HttpStatus.TOO_MANY_REQUESTS,
    );
  }
}
