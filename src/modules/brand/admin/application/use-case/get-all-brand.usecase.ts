import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { GetAllQuery } from '../query';
import { INCLUDE_NO_ACTIVE } from '../../presentation/constants';

type ExecuteParams = { query: GetAllQuery };

@Injectable()
export class GetAllBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,
  ) {}

  async execute({ query }: ExecuteParams) {
    const { data, total } = await this._brandRepository.getAll({
      ...query,
      deleted: query.deleted,
      includeNoActive: query.includeNoActive === INCLUDE_NO_ACTIVE,
    });

    return { data, total, page: query.page, limit: query.limit };
  }
}
