import { SendEmailVerificationOTPUseCase } from '@modules/auth/application/use-case/send-email-verification-otp.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { SendEmailVerificationOtpDTO } from '../application/dto/email-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _sendEmailVerificationOtpUseCase: SendEmailVerificationOTPUseCase,
  ) {}

  @Post('register/send-email-verification-otp')
  async sendEmailVerificationOtp(@Body() data: SendEmailVerificationOtpDTO) {
    return await this._sendEmailVerificationOtpUseCase.execute({
      email: data.email,
    });
  }
}
