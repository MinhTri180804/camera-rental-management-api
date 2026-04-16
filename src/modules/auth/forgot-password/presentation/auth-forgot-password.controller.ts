import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import {
  ForgotPasswordUseCase,
  ResendForgotPasswordUseCase,
  ResetPasswordUseCase,
} from '../application/use-case';
import {
  ForgotPasswordDTO,
  ResendOtpForgotPasswordDTO,
  ResetPasswordDTO,
} from '../application/dto';
import {
  IsPublic,
  ResponseMessage,
  SingleDataResponse,
} from '@shared/presentation';

@Controller('auth/forgot-password')
export class AuthForgotPasswordController {
  constructor(
    private readonly _forgotPasswordUseCase: ForgotPasswordUseCase,
    private readonly _resendForgotPasswordUseCase: ResendForgotPasswordUseCase,
    private readonly _resetPasswordUseCase: ResetPasswordUseCase,
  ) {}

  @IsPublic()
  @Post()
  @ResponseMessage('Send OTP Forgot password to email success')
  @HttpCode(HttpStatus.OK)
  async execute(
    @Body() data: ForgotPasswordDTO,
  ): Promise<SingleDataResponse<{ resendAvailableAt: number } | null>> {
    const { resendAvailableAt } =
      await this._forgotPasswordUseCase.execute(data);

    const response = new SingleDataResponse<{
      resendAvailableAt: number;
    } | null>(null);

    if (resendAvailableAt) {
      response.data = { resendAvailableAt };
    }

    return response;
  }

  @IsPublic()
  @Post('resend')
  @ResponseMessage('Resend OTP Forgot password to email success')
  @HttpCode(HttpStatus.OK)
  async resend(
    @Body() data: ResendOtpForgotPasswordDTO,
  ): Promise<SingleDataResponse<{ resendAvailableAt: number } | null>> {
    const { resendAvailableAt } =
      await this._resendForgotPasswordUseCase.execute(data);

    const response = new SingleDataResponse<{
      resendAvailableAt: number;
    } | null>(null);

    if (resendAvailableAt) {
      response.data = { resendAvailableAt };
    }

    return response;
  }

  @IsPublic()
  @Post('reset-password')
  @ResponseMessage('Reset password successfully')
  @HttpCode(HttpStatus.OK)
  async resetPassword(
    @Body() data: ResetPasswordDTO,
  ): Promise<SingleDataResponse<null>> {
    await this._resetPasswordUseCase.execute(data);

    return new SingleDataResponse<null>(null);
  }
}
