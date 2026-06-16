import {
  CloudinaryConfig,
  cloudinaryConfigName,
} from '@config/cloudinary/cloudinary.config';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { UploadImageCloudinaryException } from './exceptions';
import { Readable } from 'stream';

@Injectable()
export class CloudinaryService {
  constructor(private readonly _configService: ConfigService) {
    const { apiKey, cloudName, apiSecret } =
      this._configService.getOrThrow<CloudinaryConfig>(cloudinaryConfigName);

    cloudinary.config({
      api_key: apiKey,
      cloud_name: cloudName,
      api_secret: apiSecret,
    });
  }

  /**
   * Generates a signature for the given parameters using Cloudinary's signature algorithm.
   *
   * @param {Record<string, any>} params - The parameters for which to generate the signature.
   * @return {string} The generated signature.
   *
   * @note This method is a wrapper around Cloudinary's `utils.sign_request` function.
   *       It is used to securely sign requests to Cloudinary's API by generating a signature
   *       using Cloudinary's secret key. The signature is included in the request as a
   *       parameter named `signature` and is used by Cloudinary to authenticate the request.
   *       The parameters are passed as an object where the keys are the parameter names and
   *       the values are the corresponding parameter values.
   */
  generateSignature(params: Record<string, any>) {
    return cloudinary.utils.sign_request(params);
  }

  deleteAsset(publicId: string) {
    return cloudinary.uploader.destroy(publicId);
  }

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<UploadApiResponse> {
    return new Promise<UploadApiResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          use_filename: false,
          unique_filename: true,
          resource_type: 'image',
          format: 'webp',
          overwrite: false,
          invalidate: true,
        },
        (error, result) => {
          if (error) {
            reject(
              new UploadImageCloudinaryException({
                message: error.message,
                name: error.name,
                httpCode: error.http_code,
                requestId: error.request_id,
              }),
            );
            return;
          }

          if (!result) {
            reject(
              new UploadImageCloudinaryException({
                message: 'Upload failed: no result',
                name: 'NO_RESULT',
                httpCode: 500,
                requestId: undefined,
              }),
            );
            return;
          }

          resolve(result);
        },
      );

      Readable.from(file.buffer).pipe(uploadStream);
    });
  }
}
