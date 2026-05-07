import { Body, Controller, HttpCode, Patch, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from '@shared/infrastructure';
import { ResponseMessage, SingleDataResponse } from '@shared/presentation';
import { UpdateProfileDTO } from '../application/dto';
import { CurrentAccessTokenPayload } from '@shared/presentation/decorator/current-access-token-payload.decorator';
import { UpdateProfileUseCase } from '../application/use-case';

@Controller('profile')
export class UpdateProfileController {
  constructor(private readonly _updateProfileUseCase: UpdateProfileUseCase) {}

  @Patch('')
  @UseGuards(JwtAccessTokenGuard)
  @HttpCode(201)
  @ResponseMessage('Profile created successfully')
  async execute(
    @Body() dto: UpdateProfileDTO,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    const profile = await this._updateProfileUseCase.execute({
      userId,
      ...dto,
    });

    return new SingleDataResponse(profile);
  }
}
