import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import { BrandNotFoundException } from '@modules/brand/shared/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = { id: string };

@Injectable()
export class SoftDeleteBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,
  ) {}

  async execute({ id }: ExecuteParams) {
    const brand = await this._brandRepository.softDelete(id);
    if (!brand) throw new BrandNotFoundException();

    return brand;
  }
}
