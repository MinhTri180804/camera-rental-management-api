import { MongoTimestamp } from '@common/types/mongo-timestamp.type';
import {
  MediaLearn,
  MediaSchemaClass,
} from '@modules/media/infrastructure/persistence/schema';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaClass } from '@shared/infrastructure';
import { HydratedDocument, Types } from 'mongoose';

const COLLECTION_NAME = 'brands';

export const BRAND_COLLECTION_NAME = COLLECTION_NAME;

export type BrandDocument = HydratedDocument<
  BrandSchemaClass & MongoTimestamp & BaseSchemaClass
>;

export type BrandLearn = BrandSchemaClass &
  MongoTimestamp &
  BaseSchemaClass & { _id: Types.ObjectId };

class Seo {
  @Prop({ type: String, required: true })
  title: string;

  @Prop({ type: String, required: false, default: null })
  description: string | null;

  @Prop({ type: [String], required: false, default: [] })
  keywords: string[];
}

@Schema({
  collection: COLLECTION_NAME,
  versionKey: false,
  timestamps: true,
})
export class BrandSchemaClass extends BaseSchemaClass {
  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: String, required: false, default: null })
  description: string | null;

  @Prop({
    type: Types.ObjectId,
    ref: MediaSchemaClass.name,
    required: false,
    default: null,
  })
  logo_dark_mode: Types.ObjectId | MediaLearn | null;

  @Prop({
    type: Types.ObjectId,
    ref: MediaSchemaClass.name,
    required: false,
    default: null,
  })
  logo_light_mode: Types.ObjectId | MediaLearn | null;

  @Prop({
    type: [Types.ObjectId],
    ref: MediaSchemaClass.name,
    required: false,
    default: [],
  })
  banners: Types.ObjectId[] | MediaLearn[];

  @Prop({ type: String, required: false, default: null })
  origin_country: string | null;

  @Prop({ type: String, required: false, default: null })
  website_url: string | null;

  @Prop({ type: Boolean, required: true, default: true })
  is_active: boolean;

  @Prop({ type: Seo, required: true })
  seo: Seo;

  @Prop({ type: Number, required: true, default: 0 })
  product_count: number;
}

export const BrandSchema = SchemaFactory.createForClass(BrandSchemaClass);

BrandSchema.index(
  { slug: 1 },
  { unique: true, partialFilterExpression: { is_deleted: false } },
);
BrandSchema.index({ is_active: 1 });

export const BrandSchemaModel: ModelDefinition = {
  name: BrandSchemaClass.name,
  schema: BrandSchema,
  collection: COLLECTION_NAME,
};
