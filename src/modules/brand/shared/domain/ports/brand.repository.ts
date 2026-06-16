import { DeleteFilter } from '@common/constants';
import { BrandEntity } from '../entities/brand';
import { PartialOmitWithRequired } from '@common/types';

export interface IBrandRepository {
  create(
    data: PartialOmitWithRequired<
      BrandEntity,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted',
      'name' | 'slug' | 'seo' | 'createdBy'
    >,
  ): Promise<BrandEntity>;

  changeActive(id: string, isActive: boolean): Promise<BrandEntity | null>;

  getAll(params: {
    includeNoActive?: boolean;
    page: number;
    limit: number;
    search?: string;
    order: string;
    sort: string;
    deleted: DeleteFilter;
  }): Promise<{
    data: BrandEntity[];
    total: number;
  }>;

  getById(id: string): Promise<BrandEntity | null>;

  getBySlug(params: {
    slug: string;
    options?: { includeDeleted?: boolean; includeNoActive?: boolean };
  }): Promise<BrandEntity | null>;

  softDelete(id: string): Promise<BrandEntity | null>;

  hardDelete(id: string): Promise<void>;

  restore(id: string, newSlug?: string): Promise<BrandEntity | null>;

  getAllBySlug(slug: string): Promise<BrandEntity[]>;

  update(id: string, data: Partial<BrandEntity>): Promise<BrandEntity | null>;
}

export const BRAND_REPOSITORY = Symbol('BRAND_REPOSITORY');
