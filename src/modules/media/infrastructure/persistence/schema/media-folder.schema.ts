import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaClass, USERS_COLLECTION_NAME } from '@shared/infrastructure';
import { HydratedDocument, Types } from 'mongoose';
import { MongoTimestamp } from '@common/types/mongo-timestamp.type';

const COLLECTION_NAME = 'media_folders';

export const MEDIA_FOLDER_COLLECTION_NAME = COLLECTION_NAME;

export type MediaFolderDocument = HydratedDocument<
  MediaFolderSchemaClass & MongoTimestamp & BaseSchemaClass
>;

export type MediaFolderLean = MediaFolderSchemaClass &
  MongoTimestamp &
  BaseSchemaClass & { _id: Types.ObjectId };

@Schema({
  collection: COLLECTION_NAME,
  timestamps: true,
  versionKey: false,
})
export class MediaFolderSchemaClass extends BaseSchemaClass {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: String, required: true })
  path: string;

  @Prop({ type: String, required: false, default: null })
  description: string | null;

  @Prop({
    type: Types.ObjectId,
    ref: COLLECTION_NAME,
    required: false,
    default: null,
  })
  parent_id: Types.ObjectId | null;
}

export const MediaFolderSchema = SchemaFactory.createForClass(
  MediaFolderSchemaClass,
);

MediaFolderSchema.index(
  { name: 1, parent_id: 1 },
  { unique: true, sparse: true },
);
MediaFolderSchema.index(
  { slug: 1, parent_id: 1 },
  { unique: true, sparse: true },
);
MediaFolderSchema.index({ slug: 1, is_deleted: 1 });
MediaFolderSchema.index({ path: 1 }, { unique: true });

export const MediaFolderSchemaModel: ModelDefinition = {
  collection: COLLECTION_NAME,
  name: MediaFolderSchemaClass.name,
  schema: MediaFolderSchema,
};
