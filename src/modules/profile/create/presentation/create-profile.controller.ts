import { Body, Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { CreateProfileUseCase } from '../application/use-case/create-profile.usecase';
import { CreateProfileDTO } from '../application/dto/create.dto';
import { ResponseMessage, SingleDataResponse } from '@shared/presentation';
import { JwtAccessTokenGuard } from '@shared/infrastructure';
import { CurrentAccessTokenPayload } from '@shared/presentation/decorator/current-access-token-payload.decorator';

@Controller('profile')
export class CreateProfileController {
  constructor(private readonly _createProfileUseCase: CreateProfileUseCase) {}

  @Post('')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(201)
  @ResponseMessage('Profile created successfully')
  async execute(
    @Body() data: CreateProfileDTO,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    const profile = await this._createProfileUseCase.execute({
      ...data,
      userId,
    });

    const responseBody = new SingleDataResponse(profile);
    return responseBody;
  }
}
