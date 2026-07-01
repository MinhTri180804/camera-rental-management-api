import { IMediaReader } from '@modules/category/shared/domain/ports/reader';
import {
  MediaLearn,
  MediaSchemaClass,
} from '@modules/media/infrastructure/persistence/schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class MediaReaderImpl implements IMediaReader {
  constructor(
    @InjectModel(MediaSchemaClass.name)
    private readonly _mediaModel: Model<MediaLearn>,
  ) {}

  async existsById(id: string): Promise<{ id: string } | null> {
    const isExist = await this._mediaModel.findById(id).lean().exec();
    if (!isExist) return null;
    return { id: isExist._id.toString() };
  }
}
