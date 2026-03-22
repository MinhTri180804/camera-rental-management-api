import { EmailVerificationUseCase } from '@modules/auth/application/use-case/email-verification.usecase';
import { Body, Controller, Post } from '@nestjs/common';
import { EmailRegisterDTO } from '../application/dto/email-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly _emailVerificationUseCase: EmailVerificationUseCase,
  ) {}

  @Post('register/verification-email')
  async verificationEmail(@Body() data: EmailRegisterDTO) {
    return await this._emailVerificationUseCase.execute({
      email: data.email,
    });
  }
}
