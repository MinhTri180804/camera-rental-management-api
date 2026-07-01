import { MongoTimestamp } from '@common/types/mongo-timestamp.type';
import {
  MEDIA_STATUS,
  MEDIA_TYPE,
  type MediaStatus,
  type MediaType,
} from '@modules/media/presentation/constants';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaClass } from '@shared/infrastructure';
import { HydratedDocument, Types } from 'mongoose';
import { MEDIA_FOLDER_COLLECTION_NAME } from './media-folder.schema';

const COLLECTION_NAME = 'media';

export const MEDIA_COLLECTION_NAME = COLLECTION_NAME;

export type MediaDocument = HydratedDocument<
  MediaSchemaClass & MongoTimestamp & BaseSchemaClass
>;

export type MediaLearn = MediaSchemaClass &
  MongoTimestamp &
  BaseSchemaClass & { _id: Types.ObjectId };

@Schema({
  collection: COLLECTION_NAME,
  timestamps: true,
  versionKey: false,
})
export class MediaSchemaClass extends BaseSchemaClass {
  @Prop({ type: String, required: true })
  public_id: string;

  @Prop({ type: String, required: true })
  alt: string;

  @Prop({ enum: MEDIA_TYPE, required: true })
  type: MediaType;

  @Prop({
    type: Types.ObjectId,
    ref: MEDIA_FOLDER_COLLECTION_NAME,
    required: false,
    default: null,
  })
  folder_id: Types.ObjectId | null;

  @Prop({ type: String, required: true })
  original_name: string;

  @Prop({ type: String, required: true })
  display_name: string;

  @Prop({ type: Number, required: true })
  size: number;

  @Prop({ enum: MEDIA_STATUS, required: true })
  status: MediaStatus;
}

export const MediaSchema = SchemaFactory.createForClass(MediaSchemaClass);
export const MediaSchemaModel: ModelDefinition = {
  collection: COLLECTION_NAME,
  name: MediaSchemaClass.name,
  schema: MediaSchema,
};
