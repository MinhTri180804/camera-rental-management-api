import { InjectModel } from '@nestjs/mongoose';
import { IMediaReader } from '../../domain/ports/readers';
import {
  MediaDocument,
  MediaSchemaClass,
} from '@modules/media/infrastructure/persistence/schema';
import { Model, Types } from 'mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MediaReaderImpl implements IMediaReader {
  constructor(
    @InjectModel(MediaSchemaClass.name)
    private readonly _mediaModel: Model<MediaDocument>,
  ) {}

  async isExistsById(id: string): Promise<boolean> {
    const isExist = await this._mediaModel.exists({
      _id: new Types.ObjectId(id),
    });

    return isExist !== null;
  }
}
