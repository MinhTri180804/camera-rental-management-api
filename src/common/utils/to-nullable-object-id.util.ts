import { Types } from 'mongoose';

/**
 * Converts a nullable/optional field from a PATCH DTO into a MongoDB ObjectId,
 * preserving the three distinct update states:
 *
 * | Input       | Output                  | Effect              |
 * |-------------|-------------------------|---------------------|
 * | `undefined` | `undefined`             | Field not updated   |
 * | `null`      | `null`                  | Field set to null   |
 * | `"abc123"`  | `new Types.ObjectId(…)` | Field set to value  |
 */
export function toNullableObjectId(
  value: string | null | undefined,
): Types.ObjectId | null | undefined {
  if (value === undefined) return undefined;
  if (value === null) return null;

  return new Types.ObjectId(value);
}
