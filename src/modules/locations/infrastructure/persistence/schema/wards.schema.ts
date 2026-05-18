import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

const COLLECTION_NAME = 'wards';

export const WARDS_COLLECTION_NAME = COLLECTION_NAME;

export type WardsDocument = HydratedDocument<WardsSchemaClass>;

@Schema({
  collection: COLLECTION_NAME,
  versionKey: false,
  timestamps: false,
})
export class WardsSchemaClass {
  @Prop({
    type: Number,
    required: true,
  })
  code: number;

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
  province_code: number;
}

export const WardsSchema = SchemaFactory.createForClass(WardsSchemaClass);

WardsSchema.index({ code: 1 }, { unique: true });
WardsSchema.index({ normalized_name: 1 });
WardsSchema.index({ province_code: 1, code: 1 });

export const WardsSchemaModel: ModelDefinition = {
  name: WardsSchemaClass.name,
  schema: WardsSchema,
  collection: COLLECTION_NAME,
};
