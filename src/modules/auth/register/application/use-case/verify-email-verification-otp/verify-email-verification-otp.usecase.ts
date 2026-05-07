import {
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  type ICacheOtpEmailVerificationService,
  type IOtpEmailVerificationService,
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
} from '@modules/auth/register/domain';
import {
  type IJwtService,
  type IUserRepository,
  JWT_SERVICE_TOKEN,
  USER_REPOSITORY_TOKEN,
} from '@modules/auth/shared/domain';
import { Inject, Injectable } from '@nestjs/common';
import { VerifyEmailVerificationOtpDTO } from '../../dto';
import { InvalidOrExpiredOtpException } from '@modules/auth/shared/presentation';
import { hashPassword } from '@common/utils/hash-password.util';

@Injectable()
export class VerifyEmailVerificationOtpUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN)
    private readonly _cacheOtpEmailVerificationService: ICacheOtpEmailVerificationService,

    @Inject(OTP_EMAIL_VERIFICATION_SERVICE_TOKEN)
    private readonly _otpEmailVerificationService: IOtpEmailVerificationService,

    @Inject(JWT_SERVICE_TOKEN)
    private readonly _jwtService: IJwtService,
  ) {}

  async execute(dto: VerifyEmailVerificationOtpDTO) {
    // Otp cache is hashed, so we need to compare it with the hashed otp
    const otpCache = await this._cacheOtpEmailVerificationService.get(
      dto.email,
    );

    if (!otpCache) {
      throw new InvalidOrExpiredOtpException();
    }

    const isMatch = await this._otpEmailVerificationService.verify(
      dto.otp,
      otpCache,
    );
    if (!isMatch) {
      throw new InvalidOrExpiredOtpException();
    }

    const passwordHashed = await hashPassword(dto.password);

    const user = await this._userRepository.create({
      email: dto.email,
      password: passwordHashed,
      // Default false, user can update latter if need in setting profile
      twoFactorEnabled: false,
    });

    await this._cacheOtpEmailVerificationService.delete(dto.email);

    const accessToken = this._jwtService.signAccessToken({
      userId: user.id,
      email: user.email,
    });

    const refreshToken = this._jwtService.signRefreshToken({
      userId: user.id,
      email: user.email,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
