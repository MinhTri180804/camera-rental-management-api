import { IMediaRepository } from '@modules/media/domain/ports';
import { Injectable } from '@nestjs/common';
import { Model, QueryFilter, Types } from 'mongoose';
import { MediaDocument, MediaSchemaClass } from '../schema';
import { InjectModel } from '@nestjs/mongoose';
import { MediaEntity } from '@modules/media/domain/entities';
import { MediaMapper } from '../mapper';
import { MEDIA_STATUS } from '@modules/media/presentation/constants';

@Injectable()
export class MediaRepositoryImpl implements IMediaRepository {
  constructor(
    @InjectModel(MediaSchemaClass.name)
    private readonly _mediaModel: Model<MediaDocument>,
  ) {}

  async create(
    media: Omit<
      MediaEntity,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
    >,
  ): Promise<MediaEntity> {
    const document = MediaMapper.toPersistence(media);
    const createdDocument = await this._mediaModel.create(document);
    return MediaMapper.toDomain(createdDocument);
  }

  async hardDelete(id: string): Promise<void> {
    await this._mediaModel.findByIdAndDelete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this._mediaModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        status: MEDIA_STATUS.PENDING_DELETE,
        is_deleted: true,
        deleted_at: Date.now(),
      },
    );
  }

  async getById(id: string): Promise<MediaEntity | null> {
    const document = await this._mediaModel.findById(id);
    if (!document) {
      return null;
    }
    return MediaMapper.toDomain(document);
  }

  async setFlagDeleted(id: string): Promise<void> {
    await this._mediaModel.findOneAndUpdate(
      { _id: new Types.ObjectId(id) },
      {
        status: MEDIA_STATUS.DELETED,
        is_deleted: true,
        deleted_at: Date.now(),
      },
    );
  }

  async getAllByFolderId({
    folderId,
    search,
    page,
    limit,
    sort,
    order,
  }: {
    folderId: string | null;
    search?: string;
    page: number;
    limit: number;
    sort: string;
    order: string;
  }): Promise<{ data: MediaEntity[]; total: number }> {
    const filterQuery: QueryFilter<MediaDocument> = {
      folder_id: folderId ? new Types.ObjectId(folderId) : null,
      status: MEDIA_STATUS.ACTIVE,
    };
    const skip = (page - 1) * limit;
    const sortOption: Record<string, 1 | -1> = {
      [sort]: order === 'asc' ? 1 : -1,
    };
    if (search) filterQuery.original_name = { $regex: search, options: 'i' };
    const [data, total] = await Promise.all([
      this._mediaModel
        .find(filterQuery)
        .skip(skip)
        .limit(limit)
        .sort(sortOption),
      this._mediaModel.countDocuments(filterQuery),
    ]);

    const dataMapped = data.map((item) => MediaMapper.toDomain(item));
    return { data: dataMapped, total };
  }
}
