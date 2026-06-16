import { slugify } from '@common/utils';
import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { CreateBrandDTO } from '../dto';
import { type IMediaReader, MEDIA_READER } from '../../domain/ports/readers';
import { ValidationRequestException } from '@shared/presentation';

type ExecuteParams = {
  dto: CreateBrandDTO;
  userId: string;
};

@Injectable()
export class CreateBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,

    @Inject(MEDIA_READER)
    private readonly _mediaReader: IMediaReader,
  ) {}

  async execute({ dto, userId }: ExecuteParams) {
    const slug = dto.slug || slugify(dto.name);
    if (dto.logoDarkMode) {
      const logoDarkModeIsExist = await this._mediaReader.isExistsById(
        dto.logoDarkMode,
      );

      if (!logoDarkModeIsExist)
        throw new ValidationRequestException([
          {
            field: 'logoDarkMode',
            message: ['Logo dark mode not exists'],
          },
        ]);
    }

    if (dto.logoLightMode) {
      const logoLightModeIsExist = await this._mediaReader.isExistsById(
        dto.logoLightMode,
      );
      if (!logoLightModeIsExist)
        throw new ValidationRequestException([
          { field: 'logoLightMode', message: ['Logo light mode not exists'] },
        ]);
    }

    if (dto.banners) {
      const existsCheck = await Promise.all(
        dto.banners.map((bannerId) => this._mediaReader.isExistsById(bannerId)),
      );

      const bannersNotExist = dto.banners.filter(
        (_, index) => !existsCheck[index],
      );

      if (bannersNotExist.length > 0)
        throw new ValidationRequestException([
          {
            field: 'banners',
            message: [`BannerIds not exists: ${bannersNotExist.join(',')}}`],
          },
        ]);
    }

    const brand = await this._brandRepository.create({
      ...dto,
      slug,
      createdBy: userId,
    });
    return brand;
  }
}
