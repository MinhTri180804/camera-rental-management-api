import { PartialOmitWithRequired, PartialWithOmit } from '@common/types';
import { CategoryEntity } from '../entities/category';
import { ITransactionContext } from '@shared/domain';

export interface ICategoryRepository {
  create(
    data: PartialOmitWithRequired<
      CategoryEntity,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'isDeleted'
      | 'productCount',
      'name' | 'slug' | 'path' | 'classificationType' | 'seo' | 'createdBy'
    >,
  ): Promise<CategoryEntity>;

  getCategoryById(id: string): Promise<CategoryEntity | null>;

  getAllCategories(params: {
    parentId: string | null;
    search?: string;
    sort: string;
    order: 'asc' | 'desc';
    page: number;
    limit: number;
    isActive?: boolean;
  }): Promise<{ data: CategoryEntity[]; total: number }>;

  update({
    id,
    data,
  }: {
    id: string;
    data: PartialWithOmit<
      CategoryEntity,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'isDeleted'
      | 'productCount'
      | 'parentId'
      | 'seo'
    >;
  }): Promise<CategoryEntity | null>;

  findByPathPrefix(prefix: string): Promise<CategoryEntity[]>;

  updateChangeParentForChild(
    id: string,
    data: Pick<CategoryEntity, 'ancestors' | 'level' | 'path'>,
    context?: ITransactionContext,
  ): Promise<CategoryEntity | null>;

  updateChangeParentForParent(
    id: string,
    data: Pick<CategoryEntity, 'ancestors' | 'level' | 'path' | 'parentId'>,
    context?: ITransactionContext,
  ): Promise<CategoryEntity | null>;

  getPathById(id: string): Promise<{ path: string; id: string } | null>;
}

export const CATEGORY_REPOSITORY = Symbol('CATEGORY_REPOSITORY');
