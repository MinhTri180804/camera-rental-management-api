import { PartialOmitWithRequired, PartialWithOmit } from '@common/types';
import { CategoryEntity } from '@modules/category/shared/domain/entities/category';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { CategoryMapper } from '../mapper';
import { CategorySchemaClass } from '../schema';
import { CategoryLearn } from '../schema/categories.schema';
import { ICategoryRepository } from '@modules/category/shared/domain/ports';
import { escapeRegex, flattenObject, toNullableObjectId } from '@common/utils';
import { ITransactionContext } from '@shared/domain';
import { MongoTransactionContext } from '@shared/infrastructure/transaction-manager';

@Injectable()
export class CategoryRepositoryImpl implements ICategoryRepository {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly _categoryModel: Model<CategoryLearn>,
  ) {}

  async create(
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
  ): Promise<CategoryEntity> {
    const persistence = CategoryMapper.toPersistence(data);
    const category = await this._categoryModel.create(persistence);
    return CategoryMapper.toDomain(category);
  }

  async getAllCategories({
    parentId,
    search,
    sort,
    order,
    page,
    limit,
    isActive,
  }: {
    parentId: string | null;
    search?: string;
    sort: string;
    order: 'asc' | 'desc';
    page: number;
    limit: number;
    isActive?: boolean;
  }): Promise<{ data: CategoryEntity[]; total: number }> {
    const query: QueryFilter<CategoryLearn> = {
      parent_id: parentId ? new Types.ObjectId(parentId) : null,
    };

    if (isActive) {
      query.is_active = isActive;
    }

    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }
    const skip = (page - 1) * limit;
    const sortOption: Record<string, -1 | 1> = {
      [sort]: order === 'asc' ? 1 : -1,
    };
    const [categories, total] = await Promise.all([
      this._categoryModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .populate(['image', 'icon', 'banners']),

      this._categoryModel.countDocuments(query),
    ]);

    return {
      data: categories.map((category) => CategoryMapper.toDomain(category)),
      total,
    };
  }

  async getCategoryById(id: string): Promise<CategoryEntity | null> {
    const category = await this._categoryModel.findById(id).lean();
    return category ? CategoryMapper.toDomain(category) : null;
  }

  async update({
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
  }): Promise<CategoryEntity | null> {
    const flatData = flattenObject(data) as Record<
      keyof CategoryEntity,
      unknown
    >;

    if (data.banners) {
      flatData.banners = (data.banners as string[]).map(
        (banner) => new Types.ObjectId(banner),
      );
    }

    const category = await this._categoryModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...flatData,

            // data.image in this case only is string or null because input from client request can not is object for this field
            image: toNullableObjectId(data.image as string | null),

            // data.icon in this case only is string or null because input from client request can not is object for this field
            icon: toNullableObjectId(data.icon as string | null),
          },
        },
        { new: true },
      )
      .populate(['banners', 'icon', 'image'])
      .lean();

    if (!category) return null;

    return CategoryMapper.toDomain(category);
  }

  async findByPathPrefix(prefix: string): Promise<CategoryEntity[]> {
    const categories = await this._categoryModel
      .find({
        path: { $regex: new RegExp(`^${escapeRegex(prefix)}/`) },
      })
      .lean();

    return categories.map((category) => CategoryMapper.toDomain(category));
  }

  async updateChangeParentForChild(
    id: string,
    data: Pick<CategoryEntity, 'ancestors' | 'level' | 'path'>,
    context?: ITransactionContext,
  ): Promise<CategoryEntity | null> {
    const ancestorsPersistence = CategoryMapper.toAncestorsPersistence(
      data.ancestors,
    );
    const session =
      context instanceof MongoTransactionContext ? context.session : undefined;
    const category = await this._categoryModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        {
          ancestors: ancestorsPersistence,
          path: data.path,
          level: data.level,
        },
        {
          new: true,
        },
      )
      .session(session ?? null)
      .lean();

    if (!category) return null;
    return CategoryMapper.toDomain(category);
  }

  async updateChangeParentForParent(
    id: string,
    data: Pick<CategoryEntity, 'ancestors' | 'level' | 'path' | 'parentId'>,
    context?: ITransactionContext,
  ): Promise<CategoryEntity | null> {
    const ancestorsPersistence = CategoryMapper.toAncestorsPersistence(
      data.ancestors,
    );
    const session =
      context instanceof MongoTransactionContext ? context.session : undefined;

    const category = await this._categoryModel
      .findOneAndUpdate(
        {
          _id: new Types.ObjectId(id),
        },
        {
          ancestors: ancestorsPersistence,
          path: data.path,
          level: data.level,
          parent_id: data.parentId ? new Types.ObjectId(data.parentId) : null,
        },
        {
          new: true,
        },
      )
      .session(session ?? null)
      .lean();

    if (!category) return null;
    return CategoryMapper.toDomain(category);
  }

  async getPathById(id: string) {
    const data = await this._categoryModel
      .findOne({ _id: new Types.ObjectId(id) })
      .select('path')
      .lean();

    if (!data) return null;

    return { path: data.path, id: data._id.toString() };
  }
}
