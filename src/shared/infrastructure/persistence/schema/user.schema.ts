import { MongoTimestamp } from '@common/types/mongo-timestamp.type';
import { hashPassword } from '@common/utils/hash-password.util';
import { ModelDefinition, Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {
  CallbackWithoutResultAndOptionalError,
  HydratedDocument,
} from 'mongoose';

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

/**
 * This function is a pre-save hook for the UserSchema, it hashes the password
 * before saving it to the database.
 *
 * @param {CallbackWithoutResultAndOptionalError} next - The callback function
 *    to be called after the password has been hashed.
 * @return {Promise<void>} A promise that resolves when the password has been
 *    hashed and the callback function has been called.
 */
UserSchema.pre(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError) {
    if (this.isModified('password')) {
      // Hash the password before saving it to the database.
      this.password = await hashPassword(this.password);
    }
    // Call the callback function to continue the save operation.
    next();
  },
);

export const UserSchemaModel: ModelDefinition = {
  name: UserSchemaClass.name,
  schema: UserSchema,
  collection: COLLECTION_NAME,
};
