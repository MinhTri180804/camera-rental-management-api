import {
  CATEGORIES_COLLECTION_NAME,
  CategoryLearn,
  CategorySchemaClass,
} from '@modules/category/shared/infrastructure/persistence/schema/categories.schema';
import {
  CategoryMediaUsageReaderAbstract,
  MediaUsageResult,
} from '@modules/media/domain/ports';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class CategoryMediaUsageReaderImpl extends CategoryMediaUsageReaderAbstract {
  constructor(
    @InjectModel(CategorySchemaClass.name)
    private readonly _categoryModel: Model<CategoryLearn>,
  ) {
    super();
  }

  async findByMediaId(mediaId: string): Promise<MediaUsageResult> {
    const fields: (keyof CategoryLearn)[] = ['image', 'icon', 'banners'];

    const records = await this._categoryModel
      .find(
        {
          $or: fields.map((field) => ({
            [field]: new Types.ObjectId(mediaId),
          })),
        },
        Object.fromEntries(fields.map((field) => [field, 1])),
      )
      .lean();

    return {
      collection: CATEGORIES_COLLECTION_NAME,
      count: records.length,
      records: (
        records as unknown as Record<
          string,
          Types.ObjectId | Types.ObjectId[]
        >[]
      ).map((record) => ({
        id: record._id.toString(),
        fieldsUsage: this.resolveFieldUsages(record, fields, mediaId),
      })),
    };
  }
}
