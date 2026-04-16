import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
  type ICacheOtpEmailForgotPasswordService,
  type IOtpEmailForgotPasswordService,
  OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
} from '@modules/auth/forgot-password/domain';
import {
  type IUserRepository,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import { Inject, Injectable } from '@nestjs/common';
import { ResetPasswordDTO } from '../../dto';
import {
  DUMP_OTP,
  InvalidOrExpiredOtpException,
} from '@modules/auth/shared/presentation';
import { hashPassword } from '@common/utils/hash-password.util';

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _otpEmailForgotPasswordService: IOtpEmailForgotPasswordService,

    @Inject(CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN)
    private readonly _cacheOtpEmailForgotPasswordService: ICacheOtpEmailForgotPasswordService,
  ) {}

  async execute(data: ResetPasswordDTO) {
    const user = await this._userRepository.findByEmail(data.email);

    const cacheOtpValue = await this._cacheOtpEmailForgotPasswordService.get(
      data.email,
    );

    // Using dump otp avoid timing attack
    const isMatchOtp = await this._otpEmailForgotPasswordService.verify(
      data.otp,
      cacheOtpValue ?? DUMP_OTP,
    );

    if (!cacheOtpValue || !isMatchOtp || !user) {
      throw new InvalidOrExpiredOtpException();
    }

    const passwordHashed = await hashPassword(data.password);

    await this._userRepository.updatePassword(user.id, passwordHashed);

    await this._cacheOtpEmailForgotPasswordService.delete(data.email);

    return;
  }
}
