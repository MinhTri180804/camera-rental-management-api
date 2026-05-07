import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, UserSchemaModel } from '@shared/infrastructure';
import { USER_REPOSITORY_TOKEN } from '../shared/domain';
import { JWTModule, UserRepositoryImpl } from '../shared/infrastructure';
import {
  ResendEmailVerificationOtpUseCase,
  SendEmailVerificationOTPUseCase,
  VerifyEmailVerificationOtpUseCase,
} from './application';
import {
  CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
  OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
} from './domain';
import {
  CacheOTPVerificationServiceImpl,
  MailQueueRegisterModule,
  OtpEmailVerificationServiceImpl,
} from './infrastructure';
import { AuthRegisterController } from './presentation';

@Module({
  imports: [
    MongooseModule.forFeature([UserSchemaModel]),
    MailQueueRegisterModule,
    JWTModule,
    CacheModule,
  ],
  providers: [
    SendEmailVerificationOTPUseCase,
    ResendEmailVerificationOtpUseCase,
    VerifyEmailVerificationOtpUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
    {
      provide: OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
      useClass: OtpEmailVerificationServiceImpl,
    },
    {
      provide: CACHE_OTP_EMAIL_VERIFICATION_SERVICE_TOKEN,
      useClass: CacheOTPVerificationServiceImpl,
    },
  ],
  controllers: [AuthRegisterController],
  exports: [],
})
export class AuthRegisterModule {}
