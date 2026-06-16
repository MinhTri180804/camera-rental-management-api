import {
  type IMediaFolderRepository,
  MEDIA_FOLDER_REPOSITORY,
  MEDIA_REPOSITORY,
  type IMediaRepository,
  type IMediaStorageService,
  MEDIA_STORAGE_SERVICE,
} from '@modules/media/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { ImageMetadataDTO } from '../dto';
import { FolderMediaNotFoundException } from '@modules/media/presentation/exceptions';
import {
  MEDIA_STATUS,
  MEDIA_TYPE,
} from '@modules/media/presentation/constants';

type ExecuteParams = {
  image: Express.Multer.File;
  metadata: ImageMetadataDTO;
  userId: string;
};

@Injectable()
export class UploadImageMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly _mediaRepository: IMediaRepository,

    @Inject(MEDIA_FOLDER_REPOSITORY)
    private readonly _mediaFolderRepository: IMediaFolderRepository,

    @Inject(MEDIA_STORAGE_SERVICE)
    private readonly _mediaStorageService: IMediaStorageService,
  ) {}

  async execute({ image, metadata, userId }: ExecuteParams) {
    const { displayName, folderId = null, alt } = metadata;

    // '' is root folder
    let folderMediaPath = '';

    if (folderId) {
      const folderMedia = await this._mediaFolderRepository.getById(folderId);
      if (!folderMedia) throw new FolderMediaNotFoundException();
      folderMediaPath = folderMedia.path;
    }

    const { publicId } = await this._mediaStorageService.uploadImage(
      image,
      folderMediaPath,
    );

    try {
      const media = await this._mediaRepository.create({
        displayName,
        folderId,
        alt,
        publicId,
        type: MEDIA_TYPE.IMAGE,
        status: MEDIA_STATUS.ACTIVE,
        size: image.size,
        originalName: image.originalname,
        createdBy: userId,
      });

      return media;
    } catch (error) {
      await this._mediaStorageService.deleteImage(publicId);
      throw error;
    }
  }
}
