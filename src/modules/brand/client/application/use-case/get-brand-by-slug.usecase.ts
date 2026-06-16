import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import { BrandNotFoundException } from '@modules/brand/shared/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = {
  slug: string;
};

@Injectable()
export class GetBrandBySlugUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,
  ) {}

  async execute({ slug }: ExecuteParams) {
    const brand = await this._brandRepository.getBySlug({ slug });
    if (!brand) throw new BrandNotFoundException();
    return brand;
  }
}
