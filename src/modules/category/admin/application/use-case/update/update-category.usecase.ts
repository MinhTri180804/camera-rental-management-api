import { SpecsSchemaEntityTypes } from '@modules/category/shared/domain/entities/category';
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '@modules/category/shared/domain/ports';
import { CategorySpecsSchemaMapper } from '@modules/category/shared/infrastructure/persistence/mapper';
import { Inject, Injectable } from '@nestjs/common';
import { UpdateCategoryDTO } from '../../dto';
import { CategoryNotFoundException } from '@modules/category/shared/presentation/exceptions';
import { slugify } from '@common/utils';

type ExecuteParams = { dto: UpdateCategoryDTO; id: string };

@Injectable()
export class UpdateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly _categoryRepository: ICategoryRepository,
  ) {}

  async execute({ dto, id }: ExecuteParams) {
    let specsSchema: SpecsSchemaEntityTypes | undefined = undefined;
    let path: string | undefined = undefined;

    const category = await this._categoryRepository.getCategoryById(id);

    if (!category) throw new CategoryNotFoundException();

    if (dto.specsSchema) {
      specsSchema = CategorySpecsSchemaMapper.toEntity(dto.specsSchema);
    }

    if (dto.slug) {
      const currentPath = category.path.split('/');
      currentPath[currentPath.length - 1] = slugify(dto.slug);
      path = currentPath.join('/');
    }

    const newCategory = await this._categoryRepository.update({
      id,
      data: {
        ...dto,
        specsSchema,
        slug: dto.slug ? slugify(dto.slug) : undefined,
        path,
      },
    });

    return newCategory;
  }
}
