import { Inject, Injectable } from '@nestjs/common';
import { GetAllMediaFolderQuery } from '../query';
import {
  type IMediaFolderRepository,
  MEDIA_FOLDER_REPOSITORY,
} from '@modules/media/domain/ports';
import { FolderMediaNotFoundException } from '@modules/media/presentation/exceptions';

type ExecuteParams = { query: GetAllMediaFolderQuery };

@Injectable()
export class GetAllMediaFolderUseCase {
  constructor(
    @Inject(MEDIA_FOLDER_REPOSITORY)
    private readonly _mediaFolderRepository: IMediaFolderRepository,
  ) {}

  async execute({ query }: ExecuteParams) {
    const { page, limit, search, order, sort, parentId = null } = query;

    if (parentId) {
      const parentMediaFolder =
        await this._mediaFolderRepository.getById(parentId);
      if (!parentMediaFolder) throw new FolderMediaNotFoundException();
    }

    const { data, total } = await this._mediaFolderRepository.getAll({
      parentId,
      page,
      limit,
      search,
      order,
      sort,
    });

    return { data, total };
  }
}
