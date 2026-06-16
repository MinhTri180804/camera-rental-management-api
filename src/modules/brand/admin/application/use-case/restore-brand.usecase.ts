import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import {
  BrandNotDeletedException,
  BrandNotFoundException,
  BrandSlugExistsException,
} from '@modules/brand/shared/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { RestoreBrandDTO } from '../dto';
import { getConflictSlugIds } from '@common/utils';

type ExecuteParams = { id: string; dto: RestoreBrandDTO };

@Injectable()
export class RestoreBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,
  ) {}

  async execute({ id, dto }: ExecuteParams) {
    const brand = await this._brandRepository.getById(id);

    if (!brand) throw new BrandNotFoundException();
    if (!brand.isDeleted) throw new BrandNotDeletedException();

    const slugCheckExists = dto.newSlug ?? brand.slug;

    const brandsBySlug =
      await this._brandRepository.getAllBySlug(slugCheckExists);
    const brandsIdConflictSlug = getConflictSlugIds(brandsBySlug, brand.id);

    if (brandsIdConflictSlug.length > 0) {
      throw new BrandSlugExistsException(slugCheckExists, brandsIdConflictSlug);
    }

    const brandRestored = await this._brandRepository.restore(
      brand.id,
      slugCheckExists,
    );
    return brandRestored;
  }
}
