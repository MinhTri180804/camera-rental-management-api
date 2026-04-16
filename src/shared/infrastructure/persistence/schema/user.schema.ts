import { MongoTimestamp } from '@common/types/mongo-timestamp.type';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

const COLLECTION_NAME = 'users';

export const USERS_COLLECTION_NAME = COLLECTION_NAME;

/**
 * @note The `timestamp` option in the `@Schema` decorator of `UserSchemaClass` is set to `true`.
 *       This automatically adds the `createdAt` and `updatedAt` fields to the `UserDocument` type.
 */
export type UserDocument = HydratedDocument<UserSchemaClass & MongoTimestamp>;

@Schema({
  collection: USERS_COLLECTION_NAME,
  versionKey: false,
  timestamps: true,
})
export class UserSchemaClass {
  @Prop({
    type: String,
    required: true,
    unique: true,
    index: true,
  })
  email: string;

  @Prop({
    type: String,
    required: true,
  })
  password: string;

  @Prop({
    type: Boolean,
    default: false,
    required: false,
  })
  two_factor_enabled: boolean;
}

export const UserSchema = SchemaFactory.createForClass(UserSchemaClass);

export const UserSchemaModel: ModelDefinition = {
  name: UserSchemaClass.name,
  schema: UserSchema,
  collection: COLLECTION_NAME,
};
