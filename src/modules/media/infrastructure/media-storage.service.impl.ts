import { CloudinaryService } from '@shared/infrastructure/cloudinary';
import { IMediaStorageService } from '../domain/ports';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaStorageServiceImpl implements IMediaStorageService {
  constructor(private readonly _cloudinaryService: CloudinaryService) {}

  async uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{ publicId: string }> {
    const result = await this._cloudinaryService.uploadImage(file, folder);
    return {
      publicId: result.public_id,
    };
  }

  async deleteImage(publicId: string): Promise<void> {
    await this._cloudinaryService.deleteAsset(publicId);
  }
}
