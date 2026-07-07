import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '@modules/category/shared/domain/ports';
import { CategoryNotFoundException } from '@modules/category/shared/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = { id: string };

@Injectable()
export class GetDetailsCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly _categoryRepository: ICategoryRepository,
  ) {}

  async execute({ id }: ExecuteParams) {
    const category = await this._categoryRepository.getCategoryById(id);
    if (!category) throw new CategoryNotFoundException();

    return category;
  }
}
