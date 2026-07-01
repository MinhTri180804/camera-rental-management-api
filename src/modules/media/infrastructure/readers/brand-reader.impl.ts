import {
  BRAND_COLLECTION_NAME,
  BrandLearn,
  BrandSchemaClass,
} from '@modules/brand/shared/infrastructure/persistence/schema';
import { BrandReader, MediaUsageResult } from '@modules/media/domain/ports';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';

@Injectable()
export class BrandReaderImpl extends BrandReader {
  constructor(
    @InjectModel(BrandSchemaClass.name)
    private readonly _brandModel: Model<BrandLearn>,
  ) {
    super();
  }

  async findByMediaId(mediaId: string): Promise<MediaUsageResult> {
    const fields: (keyof BrandLearn)[] = [
      'banners',
      'logo_dark_mode',
      'logo_light_mode',
    ];

    const records = await this._brandModel
      .find(
        {
          $or: fields.map((field) => {
            if (field === 'banners') {
              return { [field]: { $in: [new Types.ObjectId(mediaId)] } };
            }

            return {
              [field]: new Types.ObjectId(mediaId),
            };
          }),
        },
        Object.fromEntries(fields.map((field) => [field, 1])),
      )
      .lean();

    return {
      collection: BRAND_COLLECTION_NAME,
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
