import { MongoTimestamp } from '@common/types/mongo-timestamp.type';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { USERS_COLLECTION_NAME } from '@shared/infrastructure';
import { HydratedDocument, Types } from 'mongoose';

const COLLECTION_NAME = 'delivery_information';

export const DELIVERY_INFORMATION_COLLECTION = COLLECTION_NAME;

export type DeliveryInformationDocument = HydratedDocument<
  DeliveryInformationSchemaClass & MongoTimestamp
>;

@Schema({
  collection: DELIVERY_INFORMATION_COLLECTION,
  versionKey: false,
  timestamps: true,
})
export class DeliveryInformationSchemaClass {
  @Prop({
    required: true,
    type: Types.ObjectId,
    ref: USERS_COLLECTION_NAME,
  })
  user_id: Types.ObjectId;

  @Prop({
    required: true,
    type: String,
  })
  name: string;

  @Prop({
    required: true,
    type: String,
  })
  normalized_name: string;

  @Prop({
    required: true,
    type: String,
  })
  fullname_recipient: string;

  @Prop({
    required: true,
    type: String,
  })
  phone_recipient: string;

  @Prop({
    required: true,
    type: {
      province: {
        code: Number,
        name: String,
        division_type: String,
      },
      ward: {
        code: Number,
        name: String,
        division_type: String,
        province_code: Number,
      },
      street: String,
    },
  })
  address: {
    province: {
      code: number;
      name: string;
      division_type: string;
    };

    ward: {
      code: number;
      name: string;
      division_type: string;
      province_code: number;
    };

    street: string;
  };
}

export const DeliveryInformationSchema = SchemaFactory.createForClass(
  DeliveryInformationSchemaClass,
);

DeliveryInformationSchema.index({ user_id: 1, normalized_name: 1 });
DeliveryInformationSchema.index({ user_id: 1 });

export const DeliveryInformationSchemaModel: ModelDefinition = {
  name: DeliveryInformationSchemaClass.name,
  schema: DeliveryInformationSchema,
  collection: DELIVERY_INFORMATION_COLLECTION,
};
