import { Inject, Injectable } from '@nestjs/common';
import {
  type IUploadAvatarSignedService,
  UPLOAD_AVATAR_SIGNED_SERVICE,
} from '../../domain/ports';

@Injectable()
export class UploadAvatarSignatureUseCase {
  constructor(
    @Inject(UPLOAD_AVATAR_SIGNED_SERVICE)
    private readonly _uploadAvatarSignedService: IUploadAvatarSignedService,
  ) {}

  execute(userId: string) {
    const result = this._uploadAvatarSignedService.generate({ userId });
    return result;
  }
}
