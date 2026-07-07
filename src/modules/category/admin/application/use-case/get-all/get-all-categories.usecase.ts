import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '@modules/category/shared/domain/ports';
import { Inject, Injectable } from '@nestjs/common';
import { GetAllCategoriesQuery } from '../../query';

type ExecuteParams = { query: GetAllCategoriesQuery };

@Injectable()
export class GetAllCategoriesUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly _categoryRepository: ICategoryRepository,
  ) {}

  async execute({ query }: ExecuteParams) {
    const {
      sort,
      search,
      page,
      parentId = null,
      limit,
      order,
      isActive,
    } = query;
    const { data, total } = await this._categoryRepository.getAllCategories({
      parentId,
      search,
      sort,
      order,
      page,
      limit,
      isActive,
    });

    return { data, total };
  }
}
