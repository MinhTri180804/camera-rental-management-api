import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { USERS_COLLECTION_NAME } from './user.schema';
import { MongoTimestamp } from '@common/types/mongo-timestamp.type';

const COLLECTION_NAME = 'profiles';

export const PROFILE_COLLECTION_NAME = COLLECTION_NAME;

/**
 * @note The `timestamp` option in the `@Schema` decorator of `UserSchemaClass` is set to `true`.
 *       This automatically adds the `createdAt` and `updatedAt` fields to the `UserDocument` type.
 */
export type ProfileDocument = HydratedDocument<
  ProfileSchemaClass & MongoTimestamp
>;

@Schema({
  collection: COLLECTION_NAME,
  timestamps: true,
  versionKey: false,
})
export class ProfileSchemaClass {
  @Prop({
    type: String,
    required: true,
  })
  first_name: string;

  @Prop({
    type: String,
    required: true,
  })
  last_name: string;

  @Prop({
    type: Types.ObjectId,
    ref: USERS_COLLECTION_NAME,
    required: true,
    unique: true,
    index: true,
  })
  user_id: Types.ObjectId;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  avatar_url: string | null;

  @Prop({
    type: String,
    required: false,
    default: null,
  })
  avatar_public_id: string | null;
}

export const ProfileSchema = SchemaFactory.createForClass(ProfileSchemaClass);
export const ProfileSchemaModel: ModelDefinition = {
  name: ProfileSchemaClass.name,
  schema: ProfileSchema,
  collection: COLLECTION_NAME,
};
