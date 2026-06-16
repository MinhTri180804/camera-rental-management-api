import {
  type IMediaStorageService,
  type IMediaRepository,
  MEDIA_STORAGE_SERVICE,
  MEDIA_REPOSITORY,
  type IMediaUsageService,
  MEDIA_USAGE_SERVICE,
} from '@modules/media/domain/ports';
import {
  MediaInUseException,
  MediaNotFoundException,
} from '@modules/media/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = { id: string };

@Injectable()
export class DeleteImageMediaUseCase {
  constructor(
    @Inject(MEDIA_REPOSITORY)
    private readonly _mediaRepository: IMediaRepository,

    @Inject(MEDIA_STORAGE_SERVICE)
    private readonly _mediaStorageService: IMediaStorageService,

    @Inject(MEDIA_USAGE_SERVICE)
    private readonly _mediaUsageService: IMediaUsageService,
  ) {}

  async execute({ id }: ExecuteParams) {
    const media = await this._mediaRepository.getById(id);

    if (!media) throw new MediaNotFoundException();

    // Check if media is used
    const usage = await this._mediaUsageService.findUsage(id);
    if (usage.length > 0) {
      throw new MediaInUseException(usage);
    }

    await this._mediaRepository.softDelete(id);

    try {
      await this._mediaStorageService.deleteImage(media.publicId);
      await this._mediaRepository.hardDelete(id);
    } catch (error) {
      console.log('DELETE IMAGE CLOUDINARY FAILED', error);
    }
  }
}
