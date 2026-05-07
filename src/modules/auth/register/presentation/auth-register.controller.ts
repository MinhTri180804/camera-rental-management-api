import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ResendEmailVerificationOtpDTO,
  ResendEmailVerificationOtpUseCase,
  SendEmailVerificationOtpDTO,
  SendEmailVerificationOTPUseCase,
  VerifyEmailVerificationOtpDTO,
  VerifyEmailVerificationOtpUseCase,
} from '../application';
import {
  IsPublic,
  ResponseMessage,
  SingleDataResponse,
} from '@shared/presentation';

@Controller('auth/register')
export class AuthRegisterController {
  constructor(
    private readonly _sendEmailVerificationOtpUseCase: SendEmailVerificationOTPUseCase,
    private readonly _verifyEmailVerificationOtpUseCase: VerifyEmailVerificationOtpUseCase,
    private readonly _resendEmailVerificationOtpUseCase: ResendEmailVerificationOtpUseCase,
  ) {}

  @IsPublic()
  @Post('send-email-verification-otp')
  @ResponseMessage('Send email verification otp success')
  @HttpCode(HttpStatus.OK)
  async sendEmailVerificationOtp(
    @Body() data: SendEmailVerificationOtpDTO,
  ): Promise<SingleDataResponse<{ resendAvailableAt: number }>> {
    const { resendAvailableAt } =
      await this._sendEmailVerificationOtpUseCase.execute({
        email: data.email,
      });

    return new SingleDataResponse({ resendAvailableAt });
  }

  @IsPublic()
  @Post('send-email-verification-otp/resend')
  @ResponseMessage('Resend email verification otp success')
  @HttpCode(HttpStatus.OK)
  async resendEmailVerificationOtp(
    @Body() data: ResendEmailVerificationOtpDTO,
  ): Promise<SingleDataResponse<{ resendAvailableAt: number }>> {
    const { resendAvailableAt } =
      await this._resendEmailVerificationOtpUseCase.execute({
        email: data.email,
      });

    return new SingleDataResponse({ resendAvailableAt });
  }

  @IsPublic()
  @Post('verify-email-verification-otp')
  @ResponseMessage('Verify email verification otp success')
  @HttpCode(HttpStatus.OK)
  async verifyEmailVerificationOtp(
    @Body() data: VerifyEmailVerificationOtpDTO,
  ): Promise<
    SingleDataResponse<{ accessToken: string; refreshToken: string }>
  > {
    const { accessToken, refreshToken } =
      await this._verifyEmailVerificationOtpUseCase.execute({
        email: data.email,
        password: data.password,
        otp: data.otp,
      });

    const responseData = new SingleDataResponse<{
      accessToken: string;
      refreshToken: string;
    }>({ accessToken, refreshToken });

    return responseData;
  }
}
