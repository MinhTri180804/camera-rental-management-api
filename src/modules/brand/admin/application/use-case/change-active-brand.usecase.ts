import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { ChangeActiveBrandDTO } from '../dto';
import { BrandNotFoundException } from '@modules/brand/shared/presentation/exceptions';

type ExecuteParams = { id: string; dto: ChangeActiveBrandDTO };

@Injectable()
export class ChangeActiveBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,
  ) {}

  async execute({ id, dto }: ExecuteParams) {
    const brand = await this._brandRepository.changeActive(id, dto.isActive);
    if (!brand) throw new BrandNotFoundException();
    return brand;
  }
}
