import {
  MEDIA_FOLDER_REPOSITORY,
  MEDIA_REPOSITORY,
  type IMediaFolderRepository,
  type IMediaRepository,
} from '@modules/media/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { GetAllMediaQuery } from '../query';
import { MediaNotFoundException } from '@modules/media/presentation/exceptions';

type ExecuteParams = { query: GetAllMediaQuery };

@Injectable()
export class GetAllMediaUseCase {
  constructor(
    @Inject(MEDIA_FOLDER_REPOSITORY)
    private readonly _mediaFolderRepository: IMediaFolderRepository,

    @Inject(MEDIA_REPOSITORY)
    private readonly _mediaRepository: IMediaRepository,
  ) {}

  async execute({ query }: ExecuteParams) {
    const { folderId = null, page, limit, search, order, sort } = query;
    if (folderId) {
      const mediaFolder = await this._mediaFolderRepository.getById(folderId);
      if (!mediaFolder) throw new MediaNotFoundException();
    }

    const { data, total } = await this._mediaRepository.getAllByFolderId({
      folderId,
      sort,
      search,
      page,
      limit,
      order,
    });

    return { data, total };
  }
}
