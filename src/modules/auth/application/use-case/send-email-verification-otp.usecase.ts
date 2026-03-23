import {
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE,
  type ICacheOtpEmailVerificationService,
} from '@modules/auth/domain/port/cache-otp-email-verification.service';
import { type IQueueMailService } from '@modules/auth/domain/port/mail-queue.service';
import {
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  type IOtpEmailVerificationService,
} from '@modules/auth/domain/port/otp-email-verification.service';
import {
  USER_REPOSITORY_TOKEN,
  type IUserRepository,
} from '@modules/auth/domain/port/user.repository';
import { MAIL_QUEUE_SERVICE_TOKEN } from '@modules/auth/infrastructure/queue/mail-queue.service.iml';
import { Inject, Injectable } from '@nestjs/common';
import { SendEmailVerificationOtpDTO } from '../dto/send-email-verification-otp.dto';

@Injectable()
export class SendEmailVerificationOTPUseCase {
  constructor(
    @Inject(USER_REPOSITORY_TOKEN)
    private readonly _userRepository: IUserRepository,

    @Inject(MAIL_QUEUE_SERVICE_TOKEN)
    private readonly _mailQueueService: IQueueMailService,

    @Inject(OTP_EMAIL_VERIFICATION_SERVICE_TOKEN)
    private readonly _otpEmailVerificationService: IOtpEmailVerificationService,

    @Inject(CACHE_OTP_EMAIL_VERIFICATION_SERVICE)
    private readonly _cacheOtpEmailVerificationService: ICacheOtpEmailVerificationService,
  ) {}

  async execute(sendEmailVerificationOtpDTO: SendEmailVerificationOtpDTO) {
    const emailIsExist = await this._userRepository.findByEmail(
      sendEmailVerificationOtpDTO.email,
    );

    if (emailIsExist) return;

    const isExistCache = await this._cacheOtpEmailVerificationService.isExist(
      sendEmailVerificationOtpDTO.email,
    );

    // TODO: implement response too many requests
    if (isExistCache) return;

    const otp = this._otpEmailVerificationService.generate() as string;
    const otpHashed = this._otpEmailVerificationService.hash(otp);

    await this._cacheOtpEmailVerificationService.set(
      sendEmailVerificationOtpDTO.email,
      otpHashed,
    );

    await this._mailQueueService.sendOTPEmailVerification(
      sendEmailVerificationOtpDTO.email,
      otp,
      Date.now() +
        this._cacheOtpEmailVerificationService.expiresTimeSeconds * 1000,
    );

    return;
  }
}
