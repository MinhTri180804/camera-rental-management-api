import { Controller, HttpCode, Post, UseGuards } from '@nestjs/common';
import { JwtAccessTokenGuard } from '@shared/infrastructure';
import { ResponseMessage, SingleDataResponse } from '@shared/presentation';
import { CurrentAccessTokenPayload } from '@shared/presentation/decorator/current-access-token-payload.decorator';
import { UploadAvatarSignatureUseCase } from '../application/use-case';

@Controller('profile/me')
export class UploadProfileController {
  constructor(
    private readonly _uploadAvatarSignatureUseCase: UploadAvatarSignatureUseCase,
  ) {}

  @Post('upload/avatar-signature')
  @HttpCode(200)
  @ResponseMessage('Upload avatar signature successfully')
  @UseGuards(JwtAccessTokenGuard)
  uploadAvatarSignature(@CurrentAccessTokenPayload('sub') userId: string) {
    const data = this._uploadAvatarSignatureUseCase.execute(userId);
    return new SingleDataResponse(data);
  }
}
