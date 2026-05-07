import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
  type ICacheOtpEmailForgotPasswordService,
  type IMailQueueForgotPasswordService,
  type IOtpEmailForgotPasswordService,
  MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
  OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
} from '@modules/auth/forgot-password/domain';
import { ResendOtpForgotPasswordDTO } from '@modules/auth/forgot-password/application/dto';

import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';

import { Inject, Injectable } from '@nestjs/common';
import {
  NotfoundOrExpiredOtpException,
  OtpResendTooEarlyException,
} from '@modules/auth/shared/presentation';
import { secondToMs } from '@common/utils/time.util';

@Injectable()
export class ResendForgotPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _queueMailForgotPasswordService: IMailQueueForgotPasswordService,

    @Inject(OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _otpEmailForgotPasswordService: IOtpEmailForgotPasswordService,

    @Inject(CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _cacheOtpEmailForgotPasswordService: ICacheOtpEmailForgotPasswordService,
  ) {}

  async execute(data: ResendOtpForgotPasswordDTO): Promise<{
    // resendAvailableAt undefined when can not resend
    resendAvailableAt: number | undefined;
  }> {
    const isExistUser = await this._userRepository.isExistByEmail(data.email);

    if (!isExistUser)
      // 🔒 Security: prevent user enumeration.
      // Always return a "fake" resendAvailableAt when user exist
      // to make the response indistinguishable from a valid flow.
      return {
        resendAvailableAt:
          Date.now() +
          secondToMs(this._cacheOtpEmailForgotPasswordService.countdownSeconds),
      };

    const isExistOtp = await this._cacheOtpEmailForgotPasswordService.isExist(
      data.email,
    );

    if (!isExistOtp) {
      throw new NotfoundOrExpiredOtpException();
    }

    const countdownOtp =
      await this._cacheOtpEmailForgotPasswordService.getCountdown(data.email);

    if (
      countdownOtp.status ===
        CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.WAIT &&
      countdownOtp.countdown
    ) {
      throw new OtpResendTooEarlyException(undefined, countdownOtp.countdown);
    }

    const otp = this._otpEmailForgotPasswordService.generate() as string;
    const otpHashed = this._otpEmailForgotPasswordService.hash(otp);

    const { expiresAt, resendAvailableAt } =
      await this._cacheOtpEmailForgotPasswordService.set(data.email, otpHashed);

    await this._queueMailForgotPasswordService.resendOTPEmailForgotPassword({
      email: data.email,
      otp,
      expiresAt,
    });

    return { resendAvailableAt };
  }
}
