import { slugify } from '@common/utils';
import {
  type IMediaFolderRepository,
  MEDIA_FOLDER_REPOSITORY,
} from '@modules/media/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { ValidationRequestException } from '@shared/presentation';
import { CreateMediaFolderDTO } from '../dto';

type ExecuteParams = { dto: CreateMediaFolderDTO; userId: string };

@Injectable()
export class CreateMediaFolderUseCase {
  constructor(
    @Inject(MEDIA_FOLDER_REPOSITORY)
    private readonly _mediaFolderRepository: IMediaFolderRepository,
  ) {}

  async execute({ dto, userId }: ExecuteParams) {
    const slug = slugify(dto.name);
    let path: string = slug;

    if (dto.parentId) {
      const parentMediaFolder = await this._mediaFolderRepository.getById(
        dto.parentId,
      );

      if (!parentMediaFolder)
        throw new ValidationRequestException([
          { field: 'parentId', message: ['Parent id not found'] },
        ]);

      path = `${parentMediaFolder.path}/${slug}`;
    }

    const mediaFolder = await this._mediaFolderRepository.create({
      name: dto.name,
      parentId: dto.parentId || null,
      description: dto.description || null,
      slug,
      path,
      createdBy: userId,
    });

    return mediaFolder;
  }
}
