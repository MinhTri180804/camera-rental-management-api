import { MongoTimestamp } from '@common/types/mongo-timestamp.type';
import {
  CLASSIFICATION_TYPE,
  type ClassificationType,
} from '@modules/category/shared/presentation/constants';
import { SpecSchema } from '@modules/category/shared/presentation/types';
import { MediaSchemaClass } from '@modules/media/infrastructure/persistence/schema';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { BaseSchemaClass } from '@shared/infrastructure';
import { HydratedDocument, Types } from 'mongoose';

@Schema({ _id: false })
class Ancestor {
  @Prop({ type: Types.ObjectId, required: true })
  _id: Types.ObjectId;

  @Prop({ type: String, required: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;
}

class Seo {
  @Prop({ type: String, required: false, default: null })
  title: string | null;

  @Prop({ type: String, required: false, default: null })
  description: string | null;

  @Prop({ type: [String], required: false, default: [] })
  keywords: string[];
}

const COLLECTION_NAME = 'categories';
export const CATEGORIES_COLLECTION_NAME = COLLECTION_NAME;

export type CategoryDocument = HydratedDocument<
  CategorySchemaClass & MongoTimestamp & BaseSchemaClass
>;

export type CategoryLearn = CategorySchemaClass &
  MongoTimestamp &
  BaseSchemaClass & { _id: Types.ObjectId };

@Schema({
  collection: CATEGORIES_COLLECTION_NAME,
  versionKey: false,
  timestamps: true,
})
export class CategorySchemaClass extends BaseSchemaClass {
  // === CORE ===
  @Prop({ type: String, required: true, unique: true })
  name: string;

  @Prop({ type: String, required: true })
  slug: string;

  @Prop({ type: String, required: false, default: null })
  description: string | null;

  // === HIERARCHY ===
  @Prop({
    type: Types.ObjectId,
    required: false,
    default: null,
    ref: CategorySchemaClass.name,
  })
  parent_id: Types.ObjectId | null;

  @Prop({ type: [Ancestor], required: false, default: [] })
  ancestors: Ancestor[];

  @Prop({ type: Number, required: false, default: 0 })
  level: number;

  @Prop({ type: String, required: true })
  path: string;

  // === DISPLAY ===
  @Prop({
    type: Types.ObjectId,
    ref: MediaSchemaClass.name,
    required: false,
    default: null,
  })
  image: Types.ObjectId | null;

  @Prop({
    type: Types.ObjectId,
    ref: MediaSchemaClass.name,
    required: false,
    default: null,
  })
  icon: Types.ObjectId | null;

  @Prop({
    type: [Types.ObjectId],
    ref: MediaSchemaClass.name,
    required: false,
    default: [],
  })
  banners: Types.ObjectId[];

  @Prop({ type: Number, required: false, default: 0 })
  sort_order: number;

  @Prop({ type: Boolean, required: false, default: true })
  is_active: boolean;

  // === CATEGORY TYPE ===
  @Prop({
    type: String,
    enum: Object.values(CLASSIFICATION_TYPE),
    required: true,
  })
  classification_type: ClassificationType;

  @Prop({ type: Types.ObjectId, required: false, default: null })
  brand_ref: Types.ObjectId | null;

  // @Prop({ type: [String], required: false, default: [] })
  // compatible_with: string[];

  // === SEO ===
  @Prop({
    type: Seo,
    required: true,
  })
  seo: {
    title: string;
    description: string | null;
    keywords: string[];
  };

  // === SPEC SCHEMA ===

  @Prop({ type: Boolean, required: false, default: false })
  inherit_specs: boolean;

  @Prop({
    type: [Object],
    required: false,
    default: [],
  })
  specs_schema: SpecSchema[];

  // === METADATA ===
  @Prop({ type: Number, required: false, default: 0 })
  product_count: number;
}

export const CategoriesSchema =
  SchemaFactory.createForClass(CategorySchemaClass);

CategoriesSchema.index({ slug: 1 }, { unique: true });
CategoriesSchema.index({ parent_id: 1 });
CategoriesSchema.index({ level: 1, isActive: 1 });

export const CategoriesSchemaModel: ModelDefinition = {
  name: CategorySchemaClass.name,
  schema: CategoriesSchema,
  collection: CATEGORIES_COLLECTION_NAME,
};
