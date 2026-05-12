import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { GetMeProfileUseCase } from '../application/use-case';
import { ResponseMessage, SingleDataResponse } from '@shared/presentation';
import { CurrentAccessTokenPayload } from '@shared/presentation/decorator/current-access-token-payload.decorator';
import { JwtAccessTokenGuard } from '@shared/infrastructure';

@Controller('profile')
export class GetProfileController {
  constructor(private readonly _getMeProfileUseCase: GetMeProfileUseCase) {}

  @Get('/me')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get me profile successfully')
  @UseGuards(JwtAccessTokenGuard)
  async getMe(@CurrentAccessTokenPayload('sub') userId: string) {
    const profile = await this._getMeProfileUseCase.execute({ userId });
    return new SingleDataResponse(profile);
  }
}
