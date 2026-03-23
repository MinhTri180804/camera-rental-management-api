import { SendEmailVerificationOTPUseCase } from '@modules/auth/application/use-case/send-email-verification-otp.usecase';
import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { SendEmailVerificationOtpDTO } from '../application/dto/send-email-verification-otp.dto';
import { SingleDataResponse } from '@shared/presentation/response/data-response';
import { ResponseMessage } from '@shared/presentation/decorator/response-message.decorator';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _sendEmailVerificationOtpUseCase: SendEmailVerificationOTPUseCase,
  ) {}

  @Post('register/send-email-verification-otp')
  @ResponseMessage('Send email verification otp success')
  @HttpCode(HttpStatus.OK)
  async sendEmailVerificationOtp(
    @Body() data: SendEmailVerificationOtpDTO,
  ): Promise<SingleDataResponse<null>> {
    await this._sendEmailVerificationOtpUseCase.execute({
      email: data.email,
    });

    return new SingleDataResponse<null>(null);
  }
}
