import { secondToMs } from '@common/utils/time.util';
import {
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  type ICacheOtpEmailVerificationService,
  type IMailQueueRegisterService,
  type IOtpEmailVerificationService,
  MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
} from '@modules/auth/register/domain';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import { OtpResendTooEarlyException } from '@modules/auth/shared/presentation';
import { Inject, Injectable } from '@nestjs/common';
import { SendEmailVerificationOtpDTO } from '../../dto';

@Injectable()
export class SendEmailVerificationOTPUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(MAIL_QUEUE_REGISTER_SERVICE_TOKEN)
    private readonly _mailQueueRegisterService: IMailQueueRegisterService,

    @Inject(OTP_EMAIL_VERIFICATION_SERVICE_TOKEN)
    private readonly _otpEmailVerificationService: IOtpEmailVerificationService,

    @Inject(CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN)
    private readonly _cacheOtpEmailVerificationService: ICacheOtpEmailVerificationService,
  ) {}

  async execute(
    sendEmailVerificationOtpDTO: SendEmailVerificationOtpDTO,
  ): Promise<{ resendAvailableAt: number }> {
    const emailIsExist = await this._userRepository.isExistByEmail(
      sendEmailVerificationOtpDTO.email,
    );

    if (emailIsExist)
      // 🔒 Security: prevent user enumeration.
      // Always return a "fake" resendAvailableAt when user exist
      // to make the response indistinguishable from a valid flow.
      return {
        resendAvailableAt:
          Date.now() +
          secondToMs(this._cacheOtpEmailVerificationService.countdownSeconds),
      };

    const countdownOtp =
      await this._cacheOtpEmailVerificationService.getCountdown(
        sendEmailVerificationOtpDTO.email,
      );

    if (
      countdownOtp.status ===
        CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.WAIT &&
      countdownOtp.countdown
    ) {
      throw new OtpResendTooEarlyException(undefined, countdownOtp.countdown);
    }

    const otp = this._otpEmailVerificationService.generate() as string;
    const otpHashed = this._otpEmailVerificationService.hash(otp);

    const { expiresAt, resendAvailableAt } =
      await this._cacheOtpEmailVerificationService.set(
        sendEmailVerificationOtpDTO.email,
        otpHashed,
      );

    await this._mailQueueRegisterService.sendOTPEmailVerification({
      email: sendEmailVerificationOtpDTO.email,
      otp,
      expiresAt,
    });

    return { resendAvailableAt };
  }
}
