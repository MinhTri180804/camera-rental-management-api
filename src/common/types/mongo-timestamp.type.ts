/**
 * This type is used to represent the createdAt and updatedAt fields of a document
 * in a MongoDB collection. When using this type, you should ensure that your
 * document schema includes the appropriate fields for 'createdAt' and 'updatedAt'
 * and that they are of type Date.
 *
 * @note When you define a schema using the `@Schema` decorator of `@nestjs/mongoose`,
 *       you can set the `timestamp` option to `true`. This will automatically add
 *       the `createdAt` and `updatedAt` fields to your document type.
 */
export type MongoTimestamp = {
  created_at: Date;
  updated_at: Date;
};
