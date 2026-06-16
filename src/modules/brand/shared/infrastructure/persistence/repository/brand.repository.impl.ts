import { DELETE_FILTER, DeleteFilter } from '@common/constants';
import { flattenObject, toNullableObjectId } from '@common/utils';
import { BrandEntity } from '@modules/brand/shared/domain/entities/brand';
import { IBrandRepository } from '@modules/brand/shared/domain/ports';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types, UpdateQuery } from 'mongoose';
import { BrandMapper } from '../mapper';
import { BrandDocument, BrandSchemaClass } from '../schema';
import { PartialOmitWithRequired } from '@common/types';

export class BrandRepositoryImpl implements IBrandRepository {
  constructor(
    @InjectModel(BrandSchemaClass.name)
    private readonly _brandModel: Model<BrandDocument>,
  ) {}

  async create(
    data: PartialOmitWithRequired<
      BrandEntity,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted',
      'name' | 'slug' | 'seo' | 'createdBy'
    >,
  ): Promise<BrandEntity> {
    const brand = await this._brandModel.create(
      BrandMapper.toPersistence(data),
    );
    return BrandMapper.toDomain({
      brandDocument: brand,
      options: { populate: { banners: false } },
    });
  }

  async changeActive(
    id: string,
    isActive: boolean,
  ): Promise<BrandEntity | null> {
    const brand = await this._brandModel
      .findByIdAndUpdate(
        id,
        {
          is_active: isActive,
        },
        { new: true },
      )
      .populate(['banners', 'logo_dark_mode', 'logo_light_mode']);

    if (!brand) return null;
    return BrandMapper.toDomain({
      brandDocument: brand,
      options: { populate: { banners: true } },
    });
  }

  async getAll({
    includeNoActive = false,
    page,
    search,
    limit,
    order,
    sort,
    deleted,
  }: {
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
  }> {
    const queryFilter: QueryFilter<BrandDocument> = {};

    switch (deleted) {
      case DELETE_FILTER.DELETED:
        queryFilter.is_deleted = true;
        break;
      case DELETE_FILTER.NOT_DELETED:
        queryFilter.is_deleted = false;
        break;
    }

    if (!includeNoActive) queryFilter.is_active = true;
    if (search) queryFilter.name = { $regex: search, $options: 'i' };
    const skip = (page - 1) * limit;
    const sortOption: Record<string, 1 | -1> = {
      [sort]: order === 'asc' ? 1 : -1,
    };
    const [brands, total] = await Promise.all([
      this._brandModel
        .find(queryFilter)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .populate(['banners', 'logo_dark_mode', 'logo_light_mode'])
        .lean(),

      this._brandModel.countDocuments(queryFilter),
    ]);
    const data = brands.map((brand) =>
      BrandMapper.toDomain({
        brandDocument: brand,
        options: { populate: { banners: true } },
      }),
    );
    return { data, total };
  }

  async getById(id: string): Promise<BrandEntity | null> {
    const brand = await this._brandModel
      .findById(id)
      .populate(['banners', 'logo_dark_mode', 'logo_light_mode'])
      .lean();
    if (!brand) return null;

    return BrandMapper.toDomain({
      brandDocument: brand,
      options: { populate: { banners: true } },
    });
  }

  async getBySlug({
    slug,
    options = {
      includeDeleted: false,
      includeNoActive: false,
    },
  }: {
    slug: string;
    options?: { includeNoActive?: boolean; includeDeleted?: boolean };
  }): Promise<BrandEntity | null> {
    const filterQuery: QueryFilter<BrandDocument> = {};
    if (!options?.includeNoActive) filterQuery.is_active = true;
    if (!options?.includeDeleted) filterQuery.is_deleted = false;
    const brand = await this._brandModel
      .findOne({ ...filterQuery, slug })
      .populate(['banners', 'logo_dark_mode', 'logo_light_mode'])
      .lean();
    if (!brand) return null;
    return BrandMapper.toDomain({
      brandDocument: brand,
      options: {
        populate: {
          banners: true,
        },
      },
    });
  }

  async softDelete(id: string): Promise<BrandEntity | null> {
    const brand = await this._brandModel.findByIdAndUpdate(id, {
      deleted_at: new Date(),
      is_deleted: true,
    });
    if (!brand) return null;
    return BrandMapper.toDomain({ brandDocument: brand });
  }

  async hardDelete(id: string): Promise<void> {
    await this._brandModel.deleteOne({ _id: new Types.ObjectId(id) });
  }

  async restore(id: string, newSlug?: string): Promise<BrandEntity | null> {
    const updateQuery: UpdateQuery<BrandDocument> = {
      deleted_at: null,
      is_deleted: false,
    };
    if (newSlug) updateQuery.slug = newSlug;
    const brand = await this._brandModel
      .findByIdAndUpdate(id, updateQuery, {
        new: true,
      })
      .populate(['banners', 'logo_dark_mode', 'logo_light_mode']);
    if (!brand) return null;
    return BrandMapper.toDomain({
      brandDocument: brand,
      options: { populate: { banners: true } },
    });
  }

  async getAllBySlug(slug: string): Promise<BrandEntity[]> {
    const brands = await this._brandModel
      .find({ slug })
      .populate(['banners', 'logo_dark_mode', 'logo_light_mode']);
    return brands.map((brand) =>
      BrandMapper.toDomain({
        brandDocument: brand,
        options: { populate: { banners: true } },
      }),
    );
  }

  async update(
    id: string,
    data: Partial<BrandEntity>,
  ): Promise<BrandEntity | null> {
    const flatData = flattenObject(data);
    const brand = await this._brandModel
      .findByIdAndUpdate(
        id,
        {
          $set: {
            ...flatData,
            logo_light_mode: toNullableObjectId(
              // data.logoLightMode in this case only is string or null because input from client request can not is object for this field
              data.logoLightMode as string | null,
            ),
            logo_dark_mode: toNullableObjectId(
              // data.logoDarkMode in this case only is string or null because input from client request can not is object for this field
              data.logoDarkMode as string | null,
            ),
          },
        },
        { new: true },
      )
      .populate(['banners', 'logo_dark_mode', 'logo_light_mode']);
    if (!brand) return null;
    return BrandMapper.toDomain({
      brandDocument: brand,
      options: { populate: { banners: true } },
    });
  }
}
