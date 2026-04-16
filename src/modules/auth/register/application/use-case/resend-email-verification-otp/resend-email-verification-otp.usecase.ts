import { Inject, Injectable } from '@nestjs/common';
import { ResendEmailVerificationOtpDTO } from '../../dto';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import {
  CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS,
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  type ICacheOtpEmailVerificationService,
  type IOtpEmailVerificationService,
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
} from '@modules/auth/register/domain';
import {
  MAIL_QUEUE_REGISTER_SERVICE_TOKEN,
  type IMailQueueRegisterService,
} from '@modules/auth/register/domain';
import {
  NotfoundOrExpiredOtpException,
  OtpResendTooEarlyException,
} from '@modules/auth/shared/presentation';
import { secondToMs } from '@common/utils/time.util';

@Injectable()
export class ResendEmailVerificationOtpUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN)
    private readonly _cacheOtpEmailVerification: ICacheOtpEmailVerificationService,

    @Inject(OTP_EMAIL_VERIFICATION_SERVICE_TOKEN)
    private readonly _otpEmailVerificationService: IOtpEmailVerificationService,

    @Inject(MAIL_QUEUE_REGISTER_SERVICE_TOKEN)
    private readonly _mailQueueRegisterService: IMailQueueRegisterService,
  ) {}

  async execute(
    data: ResendEmailVerificationOtpDTO,
  ): Promise<{ resendAvailableAt: number }> {
    const isUserExist = await this._userRepository.isExistByEmail(data.email);

    if (isUserExist)
      // 🔒 Security: prevent user enumeration.
      // Always return a "fake" resendAvailableAt when user exist
      // to make the response indistinguishable from a valid flow.
      return {
        resendAvailableAt:
          Date.now() +
          secondToMs(this._cacheOtpEmailVerification.countdownSeconds),
      };

    const isExistOtp = await this._cacheOtpEmailVerification.isExist(
      data.email,
    );

    if (!isExistOtp) {
      throw new NotfoundOrExpiredOtpException();
    }

    const isExistCountdownOtp =
      await this._cacheOtpEmailVerification.getCountdown(data.email);

    if (
      isExistCountdownOtp.status ===
      CACHE_OTP_EMAIL_VERIFICATION_COUNTDOWN_STATUS.WAIT
    ) {
      throw new OtpResendTooEarlyException(
        undefined,
        isExistCountdownOtp.countdown!,
      );
    }

    const newOtp = this._otpEmailVerificationService.generate() as string;
    const newOtpHashed = this._otpEmailVerificationService.hash(newOtp);

    const { expiresAt, resendAvailableAt } =
      await this._cacheOtpEmailVerification.set(data.email, newOtpHashed);

    await this._mailQueueRegisterService.resendOtpEmailVerification({
      email: data.email,
      otp: newOtp,
      expiresAt,
    });

    return { resendAvailableAt };
  }
}
