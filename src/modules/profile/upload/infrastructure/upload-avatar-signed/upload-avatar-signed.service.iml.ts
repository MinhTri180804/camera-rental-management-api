import { Injectable } from '@nestjs/common';
import { IUploadAvatarSignedService } from '../../domain/ports';
import { CloudinaryService } from '@shared/infrastructure/cloudinary/cloudinary.service';
import { CLOUDINARY_PRESET } from '@shared/infrastructure/cloudinary';
import { ConfigService } from '@nestjs/config';
import {
  CloudinaryConfig,
  cloudinaryConfigName,
} from '@config/cloudinary/cloudinary.config';

@Injectable()
export class UploadAvatarSignedServiceIml implements IUploadAvatarSignedService {
  constructor(
    private readonly _cloudinaryService: CloudinaryService,
    private readonly _configService: ConfigService,
  ) {}

  private readonly _getAvatarFolder = (userId: string) =>
    `users/${userId}/avatar`;

  generate({ userId }: { userId: string }): {
    signature: string;
    timestamp: number;
    apiKey: string;
    cloudName: string;
    uploadPreset: string;
    folder: string;
    publicId: string;
  } {
    const { cloudName } =
      this._configService.getOrThrow<CloudinaryConfig>(cloudinaryConfigName);
    const timestamp = Math.floor(Date.now() / 1000);
    const signedParams = {
      upload_preset: CLOUDINARY_PRESET.USER_AVATAR,
      timestamp,
      folder: this._getAvatarFolder(userId),
      public_id: 'current',
      invalidate: true,
    };

    const { api_key, signature } =
      this._cloudinaryService.generateSignature(signedParams);

    return {
      signature,
      apiKey: api_key,
      uploadPreset: signedParams.upload_preset,
      cloudName,
      folder: signedParams.folder,
      timestamp,
      publicId: signedParams.public_id,
    };
  }

  async delete({ userId }: { userId: string }): Promise<void> {
    await this._cloudinaryService.deleteAsset(
      `${this._getAvatarFolder(userId)}/current`,
    );
  }
}
