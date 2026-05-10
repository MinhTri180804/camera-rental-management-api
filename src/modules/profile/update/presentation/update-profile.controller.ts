import {
  Body,
  Controller,
  Delete,
  HttpCode,
  Patch,
  UseGuards,
} from '@nestjs/common';
import { JwtAccessTokenGuard } from '@shared/infrastructure';
import { ResponseMessage, SingleDataResponse } from '@shared/presentation';
import { UpdateAvatarDTO, UpdateProfileDTO } from '../application/dto';
import { CurrentAccessTokenPayload } from '@shared/presentation/decorator/current-access-token-payload.decorator';
import {
  UpdateAvatarUseCase,
  UpdateProfileUseCase,
} from '../application/use-case';
import { DeleteAvatarUseCase } from '../application/use-case/delete-avatar.usecase';

@Controller('profile')
export class UpdateProfileController {
  constructor(
    private readonly _updateProfileUseCase: UpdateProfileUseCase,
    private readonly _updateAvatarUseCase: UpdateAvatarUseCase,
    private readonly _deleteAvatarUseCase: DeleteAvatarUseCase,
  ) {}

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

  @Patch('me/avatar')
  @HttpCode(200)
  @ResponseMessage('Profile avatar updated successfully')
  @UseGuards(JwtAccessTokenGuard)
  async updateProfileAvatar(
    @Body() dto: UpdateAvatarDTO,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    const profile = await this._updateAvatarUseCase.execute({
      userId,
      ...dto,
    });

    return new SingleDataResponse(profile);
  }

  @Delete('me/avatar')
  @HttpCode(200)
  @ResponseMessage('Delete avatar successfully')
  @UseGuards(JwtAccessTokenGuard)
  async deleteAvatar(@CurrentAccessTokenPayload('sub') userId: string) {
    const profile = await this._deleteAvatarUseCase.execute({ userId });

    return new SingleDataResponse(profile);
  }
}
