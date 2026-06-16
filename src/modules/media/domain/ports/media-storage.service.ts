export interface IMediaStorageService {
  uploadImage(
    file: Express.Multer.File,
    folder: string,
  ): Promise<{
    publicId: string;
  }>;

  deleteImage(publicId: string): Promise<void>;
}

export const MEDIA_STORAGE_SERVICE = Symbol('MEDIA_STORAGE_SERVICE');
