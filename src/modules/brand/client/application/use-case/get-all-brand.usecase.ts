import { BrandEntity } from '@modules/brand/shared/domain/entities/brand';
import {
  BRAND_REPOSITORY,
  type IBrandRepository,
} from '@modules/brand/shared/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { DELETE_FILTER } from '@common/constants';
import { GetAllQuery } from '../query';

type ExecuteParams = { query: GetAllQuery };

@Injectable()
export class GetAllBrandUseCase {
  constructor(
    @Inject(BRAND_REPOSITORY)
    private readonly _brandRepository: IBrandRepository,
  ) {}

  async execute({ query }: ExecuteParams): Promise<{
    data: BrandEntity[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { data, total } = await this._brandRepository.getAll({
      includeNoActive: false,
      page: query.page,
      limit: query.limit,
      search: query.search,
      order: query.order,
      sort: query.sort,
      deleted: DELETE_FILTER.NOT_DELETED,
    });

    return { data, total, page: query.page, limit: query.limit };
  }
}
