import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateBrandDTO } from '../dto';
import {
  BrandNotFoundException,
  BrandSlugExistsException,
} from '@modules/brand/shared/presentation/exceptions';
import { getConflictSlugIds } from '@common/utils';
import { type IMediaReader, MEDIA_READER } from '../../domain/ports/readers';
import { ValidationRequestException } from '@shared/presentation';

type ExecuteParams = {
  id: string;
  dto: UpdateBrandDTO;
};

@Injectable()
export class UpdateBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,

    @Inject(MEDIA_READER)
    private readonly _mediaReader: IMediaReader,
  ) {}

  async execute({ id, dto }: ExecuteParams) {
    console.log('[DTO]: ', dto);

    if (dto.slug) {
      const brandsBySlug = await this._brandRepository.getAllBySlug(dto.slug);
      const brandsIdConflictSlug = getConflictSlugIds(brandsBySlug, id);

      if (brandsIdConflictSlug.length > 0)
        throw new BrandSlugExistsException(dto.slug, brandsIdConflictSlug);
    }

    if (dto.logoDarkMode) {
      const isExist = await this._mediaReader.isExistsById(dto.logoDarkMode);
      if (!isExist)
        throw new ValidationRequestException([
          {
            field: 'logoDarkMode',
            message: [`Logo dark mode not exists: ${dto.logoDarkMode}}`],
          },
        ]);
    }

    if (dto.logoLightMode) {
      const isExist = await this._mediaReader.isExistsById(dto.logoLightMode);
      if (!isExist)
        throw new ValidationRequestException([
          {
            field: 'logoLightMode',
            message: [`Logo light mode not exists: ${dto.logoLightMode}}`],
          },
        ]);
    }

    if (dto.banners) {
      const existsCheck = await Promise.all(
        dto.banners.map((bannerId) => this._mediaReader.isExistsById(bannerId)),
      );

      const bannersNotExists = dto.banners.filter(
        (_, index) => !existsCheck[index],
      );

      if (bannersNotExists.length > 0)
        throw new ValidationRequestException([
          {
            field: 'banners',
            message: [`BannerIds not exists: ${bannersNotExists.join(',')}}`],
          },
        ]);
    }

    const brand = await this._brandRepository.update(id, dto);
    if (!brand) throw new BrandNotFoundException();

    return brand;
  }
}
