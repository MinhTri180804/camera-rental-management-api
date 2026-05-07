import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CacheModule, UserSchemaModel } from '@shared/infrastructure';
import { USER_REPOSITORY_TOKEN } from '../shared/domain';
import { UserRepositoryImpl } from '../shared/infrastructure';
import {
  ForgotPasswordUseCase,
  ResendForgotPasswordUseCase,
  ResetPasswordUseCase,
} from './application/use-case';
import {
  CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
  OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
} from './domain';
import {
  CacheOtpForgotPasswordServiceIml,
  MailQueueModule,
  OtpEmailForgotPasswordServiceIml,
} from './infrastructure';
import { AuthForgotPasswordController } from './presentation';

@Module({
  imports: [
    MailQueueModule,
    MongooseModule.forFeature([UserSchemaModel]),
    CacheModule,
  ],
  providers: [
    ForgotPasswordUseCase,
    ResetPasswordUseCase,
    ResendForgotPasswordUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },

    {
      provide: CACHE_OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
      useClass: CacheOtpForgotPasswordServiceIml,
    },
    {
      provide: OTP_EMAIL_FORGOT_PASSWORD_SERVICE_TOKEN,
      useClass: OtpEmailForgotPasswordServiceIml,
    },
  ],
  controllers: [AuthForgotPasswordController],
  exports: [],
})
export class AuthForgotPasswordModule {}
