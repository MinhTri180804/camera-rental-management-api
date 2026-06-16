import { MediaFolderEntity } from '@modules/media/domain/entities';
import { IMediaFolderRepository } from '@modules/media/domain/ports';
import { InjectModel } from '@nestjs/mongoose';
import { Model, QueryFilter, Types } from 'mongoose';
import { MediaFolderMapper } from '../mapper';
import { MediaFolderDocument, MediaFolderSchemaClass } from '../schema';

export class MediaFolderRepositoryImpl implements IMediaFolderRepository {
  constructor(
    @InjectModel(MediaFolderSchemaClass.name)
    private readonly _mediaFolderModel: Model<MediaFolderDocument>,
  ) {}

  async create(
    entity: Omit<
      MediaFolderEntity,
      'id' | 'deletedAt' | 'isDeleted' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<MediaFolderEntity> {
    const persistence = MediaFolderMapper.toPersistence(entity);
    const data = await this._mediaFolderModel.create(persistence);
    return MediaFolderMapper.toDomain(data);
  }

  async getAll({
    parentId,
    page,
    search,
    limit,
    order,
    sort,
  }: {
    parentId: string | null;
    page: number;
    search?: string;
    limit: number;
    order: string;
    sort: string;
  }): Promise<{ total: number; data: MediaFolderEntity[] }> {
    const query: QueryFilter<MediaFolderDocument> = {
      is_deleted: false,
      deleted_at: null,
      parent_id: parentId ? new Types.ObjectId(parentId) : null,
    };

    const skip = (page - 1) * limit;
    if (search) query.name = { $regex: search, $options: 'i' };
    const sortOption: Record<string, 1 | -1> = {
      [sort]: order === 'asc' ? 1 : -1,
    };

    const [data, total] = await Promise.all([
      this._mediaFolderModel
        .find(query)
        .skip(skip)
        .limit(limit)
        .sort(sortOption)
        .lean(),
      this._mediaFolderModel.countDocuments(query),
    ]);

    const dataMapped = data.map((item) => MediaFolderMapper.toDomain(item));
    return { total, data: dataMapped };
  }

  async getById(id: string): Promise<MediaFolderEntity | null> {
    const mediaFolder = await this._mediaFolderModel.findOne({
      _id: id,
      is_deleted: false,
    });
    if (!mediaFolder) return null;

    return MediaFolderMapper.toDomain(mediaFolder);
  }

  async getBySlug(slug: string): Promise<MediaFolderEntity | null> {
    const mediaFolder = await this._mediaFolderModel
      .findOne({ slug: slug, is_deleted: false })
      .lean();
    if (!mediaFolder) return null;

    return MediaFolderMapper.toDomain(mediaFolder);
  }

  async getByPath(path: string): Promise<MediaFolderEntity | null> {
    const mediaFolder = await this._mediaFolderModel.findOne({ path }).lean();
    if (!mediaFolder) return null;

    return MediaFolderMapper.toDomain(mediaFolder);
  }
}
