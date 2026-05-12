import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

const COLLECTION_NAME = 'provinces';

export const PROVINCES_SCHEMA_NAME = COLLECTION_NAME;

export type ProvincesDocument = HydratedDocument<ProvincesSchemaClass>;

@Schema({
  collection: COLLECTION_NAME,
  timestamps: false,
  versionKey: false,
})
export class ProvincesSchemaClass {
  @Prop({
    type: String,
    required: true,
  })
  name: string;

  @Prop({
    type: String,
    required: true,
  })
  normalized_name: string;

  @Prop({
    type: Number,
    required: true,
  })
  code: number;

  @Prop({
    type: String,
    required: true,
  })
  division_type: string;

  @Prop({
    type: String,
    required: true,
  })
  code_name: string;

  @Prop({
    type: Number,
    required: true,
  })
  phone_code: number;
}

export const ProvincesSchema =
  SchemaFactory.createForClass(ProvincesSchemaClass);

ProvincesSchema.index({ code: 1 }, { unique: true });
ProvincesSchema.index({ normalized_name: 1 });

export const ProvincesSchemaModel: ModelDefinition = {
  name: ProvincesSchemaClass.name,
  schema: ProvincesSchema,
  collection: COLLECTION_NAME,
};
