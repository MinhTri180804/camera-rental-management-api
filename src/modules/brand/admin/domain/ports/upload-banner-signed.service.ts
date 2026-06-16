import { CloudinaryPreset } from '@shared/infrastructure/cloudinary';

export interface IUploadBannerSignedService {
  generate(brandId: string): {
    signature: string;
    timestamp: number;
    apiKey: string;
    folder: string;
    cloudName: string;
    upload_preset: CloudinaryPreset;
  };

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
  }[];
}

export const UPLOAD_BRAND_BANNER_SIGNED_SERVICE = Symbol(
  'UPLOAD_BRAND_BANNER_SIGNED_SERVICE',
);
