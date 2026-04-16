import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDTO, LoginUseCase } from '../application';
import {
  IsPublic,
  ResponseMessage,
  SingleDataResponse,
} from '@shared/presentation';

@Controller('auth/login')
export class AuthLoginController {
  constructor(private readonly _loginUseCase: LoginUseCase) {}

  @IsPublic()
  @Post()
  @ResponseMessage('Login is successfully')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() data: LoginDTO,
  ): Promise<
    SingleDataResponse<{ accessToken: string; refreshToken: string }>
  > {
    const { accessToken, refreshToken } =
      await this._loginUseCase.execute(data);

    return new SingleDataResponse({ accessToken, refreshToken });
  }
}
