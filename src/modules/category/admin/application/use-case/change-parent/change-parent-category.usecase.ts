import { Inject, Injectable } from '@nestjs/common';
import { ChangeParentCategoryDTO } from '../../dto';
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '@modules/category/shared/domain/ports';
import {
  CategoryNotFoundException,
  ChildCategoriesNotFoundException,
  ParentCategoryNotFoundException,
  UnprocessableCategoryException,
} from '@modules/category/shared/presentation/exceptions';
import {
  AncestorEntity,
  CategoryEntity,
} from '@modules/category/shared/domain/entities/category';
import {
  ITransactionContext,
  TRANSACTION_MANAGER_SERVICE,
  type ITransactionManagerService,
} from '@shared/domain';

type ExecuteParams = {
  id: string;
  dto: ChangeParentCategoryDTO;
};

@Injectable()
export class ChangeParentCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly _categoryRepository: ICategoryRepository,

    @Inject(TRANSACTION_MANAGER_SERVICE)
    private readonly _transactionManagerService: ITransactionManagerService,
  ) {}

  async execute({ id, dto }: ExecuteParams) {
    const categoryPathData = await this._categoryRepository.getPathById(id);
    if (!categoryPathData) throw new CategoryNotFoundException();

    const data = await this._transactionManagerService.runInTransaction(
      async (context) => {
        const categoryUpdated = await this._movingCategory({
          categoryId: id,
          newParentId: dto.parentId,
          context,
        });

        const childUpdated = await this._updateChildren({
          oldPath: categoryPathData.path,
          newPath: categoryUpdated.path,
          newAncestors: categoryUpdated.ancestors,
          categoryId: id,
          context,
        });

        return {
          category: categoryUpdated,
          childCategories: childUpdated,
        };
      },
    );

    return data;
  }

  private async _movingCategory({
    categoryId,
    newParentId,
    context,
  }: {
    categoryId: string;
    newParentId: string | null;
    context: ITransactionContext;
  }) {
    const category = await this._categoryRepository.getCategoryById(categoryId);
    if (!category) throw new CategoryNotFoundException();

    if (!newParentId) {
      return (await this._categoryRepository.updateChangeParentForParent(
        category.id,
        {
          ancestors: [],
          path: category.slug,
          level: 0,
          parentId: null,
        },
        context,
      )) as CategoryEntity;
    }

    const parentCategory =
      await this._categoryRepository.getCategoryById(newParentId);
    if (!parentCategory) throw new ParentCategoryNotFoundException();
    const isMovingIntoChild =
      parentCategory.ancestors.some((ancestor) => ancestor.id === categoryId) ||
      parentCategory.id === categoryId;

    if (isMovingIntoChild) throw new UnprocessableCategoryException();

    const newAncestors = [
      ...parentCategory.ancestors,
      {
        id: parentCategory.id,
        name: parentCategory.name,
        slug: parentCategory.slug,
      },
    ];

    const newPath = `${parentCategory.path}/${category.slug}`;

    const parentCategoryUpdated =
      await this._categoryRepository.updateChangeParentForParent(
        categoryId,
        {
          ancestors: newAncestors,
          path: newPath,
          level: newAncestors.length,
          parentId: newParentId || null,
        },
        context,
      );

    if (!parentCategoryUpdated) throw new CategoryNotFoundException();

    return parentCategoryUpdated;
  }

  private async _updateChildren({
    oldPath,
    newPath,
    newAncestors,
    categoryId,
    context,
  }: {
    oldPath: string;
    newPath: string;
    newAncestors: AncestorEntity[];
    categoryId: string;
    context: ITransactionContext;
  }) {
    const childCategories =
      await this._categoryRepository.findByPathPrefix(oldPath);

    const childCategoriesIdNotFound: string[] = [];
    const childCategoriesUpdated: CategoryEntity[] = [];

    for (const childCategory of childCategories) {
      const updatedPath = childCategory.path.replace(oldPath, newPath);

      const ownAncestorIndex = childCategory.ancestors.findIndex(
        (ancestor) => ancestor.id === categoryId,
      );

      if (ownAncestorIndex === -1) {
        //   TODO: ancestor referent with parent category not exists in ancestor of child category
      }

      const ownAncestor = childCategory.ancestors.slice(ownAncestorIndex);
      const updatedAncestor = [...newAncestors, ...ownAncestor];
      const childCategoryUpdated =
        await this._categoryRepository.updateChangeParentForChild(
          childCategory.id,
          {
            ancestors: updatedAncestor,
            path: updatedPath,
            level: updatedAncestor.length,
          },
          context,
        );

      if (!childCategoryUpdated) {
        childCategoriesIdNotFound.push(childCategory.id);
      } else {
        childCategoriesUpdated.push(childCategoryUpdated);
      }
    }

    if (childCategoriesIdNotFound.length > 0) {
      throw new ChildCategoriesNotFoundException(childCategoriesIdNotFound);
    }

    return childCategoriesUpdated;
  }
}
