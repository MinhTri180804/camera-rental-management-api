import { secondToMs } from '@common/utils/time.util';
import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
  type ICacheOtpEmailForgotPasswordService,
  type IMailQueueForgotPasswordService,
  type IOtpEmailForgotPasswordService,
  MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN,
  OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
} from '@modules/auth/forgot-password/domain';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import { OtpCountDownNotExpiredException } from '@modules/auth/shared/presentation';
import { Inject, Injectable } from '@nestjs/common';
import { ForgotPasswordDTO } from '../../dto';

@Injectable()
export class ForgotPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(MAIL_QUEUE_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _mailQueueForgotPasswordService: IMailQueueForgotPasswordService,

    @Inject(CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _cacheOtpForgotPasswordService: ICacheOtpEmailForgotPasswordService,

    @Inject(OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _otpEmailForgotPasswordService: IOtpEmailForgotPasswordService,
  ) {}

  async execute(data: ForgotPasswordDTO): Promise<{
    // resendAvailableAt undefined when flow forgot password valid with rules
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
          secondToMs(this._cacheOtpForgotPasswordService.countdownSeconds),
      };

    const countdownOtp = await this._cacheOtpForgotPasswordService.getCountdown(
      data.email,
    );

    if (
      countdownOtp.status ===
        CACHE_OTP_EMAIL_FORGOT_PASSWORD_COUNTDOWN_STATUS.WAIT &&
      countdownOtp.countdown
    ) {
      throw new OtpCountDownNotExpiredException(countdownOtp.countdown);
    }

    const otp = this._otpEmailForgotPasswordService.generate() as string;
    const otpHashed = this._otpEmailForgotPasswordService.hash(otp);

    const { expiresAt, resendAvailableAt } =
      await this._cacheOtpForgotPasswordService.set(data.email, otpHashed);

    await this._mailQueueForgotPasswordService.sendOTPEmailForgotPassword({
      email: data.email,
      otp,
      expiresAt,
    });

    return { resendAvailableAt };
  }
}
