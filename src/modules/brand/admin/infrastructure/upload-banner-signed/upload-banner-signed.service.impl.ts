import { ConfigService } from '@nestjs/config';
import { IUploadBannerSignedService } from '../../domain/ports';
import {
  CLOUDINARY_PRESET,
  CloudinaryPreset,
  CloudinaryService,
} from '@shared/infrastructure/cloudinary';
import { Injectable } from '@nestjs/common';
import {
  CloudinaryConfig,
  cloudinaryConfigName,
} from '@config/cloudinary/cloudinary.config';

@Injectable()
export class UploadBannerSignedServiceImpl implements IUploadBannerSignedService {
  constructor(
    private readonly _configService: ConfigService,
    private readonly _cloudinaryService: CloudinaryService,
  ) {}

  private _getFolder(brandId: string) {
    return `brands/${brandId}/banners`;
  }

  generate(brandId: string): {
    signature: string;
    timestamp: number;
    apiKey: string;
    folder: string;
    cloudName: string;
    upload_preset: CloudinaryPreset;
  } {
    const { cloudName } =
      this._configService.getOrThrow<CloudinaryConfig>(cloudinaryConfigName);

    const timestamp = Math.round(Date.now() / 1000);
    const signedParams = {
      timestamp,
      folder: this._getFolder(brandId),
      upload_preset: CLOUDINARY_PRESET.BANNER_BRAND,
    };

    const { api_key: apiKey, signature } =
      this._cloudinaryService.generateSignature(signedParams);

    return {
      ...signedParams,
      cloudName,
      apiKey,
      signature,
    };
  }

  generateBatch(
    brandId: string,
    count: number,
  ): {
    signature: string;
    timestamp: number;
    apiKey: string;
    folder: string;
    cloudName: string;
    upload_preset: CloudinaryPreset;
  }[] {
    const results: {
      signature: string;
      timestamp: number;
      apiKey: string;
      folder: string;
      cloudName: string;
      upload_preset: CloudinaryPreset;
    }[] = [];

    for (let i = 0; i < count; i++) {
      results.push(this.generate(brandId));
    }

    return results;
  }
}
