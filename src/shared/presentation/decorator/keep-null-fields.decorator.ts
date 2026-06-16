import { SetMetadata } from '@nestjs/common';

export const KEEP_NULL_FIELDS_KEY = Symbol('KEEP_NULL_FIELDS');

/**
 * Class decorator that whitelists specific DTO fields to retain their `null` value
 * after being processed by `StrictValidationPipe`.
 *
 * ---
 *
 * ### Background
 * `StrictValidationPipe` internally calls `cleanObject()` to strip out fields
 * with `undefined` or `null` values before returning the transformed object.
 * However, in **PATCH (partial update) APIs**, three distinct states must be preserved:
 *
 * | Incoming value | Meaning                          | Expected behavior         |
 * |----------------|----------------------------------|---------------------------|
 * | `undefined`    | Field was **not sent**           | Do not update this field  |
 * | `null`         | Field was **explicitly set null**| Update field to `null`    |
 * | `"value"`      | Field was **sent with a value**  | Update field to the value |
 *
 * By default, `cleanObject()` removes `null` values, making it impossible to
 * distinguish between "not sent" and "explicitly nullified".
 * This decorator solves that by telling the pipe which fields should survive the cleaning step.
 *
 * ---
 *
 * ### Usage
 * Apply to the DTO class of a PATCH endpoint, passing the names of fields
 * that are typed as `T | null` and need to support explicit null updates.
 *
 * @param fields - Names of the fields that are allowed to hold a `null` value
 *
 * @example
 * ```typescript
 * @KeepNullFields('description', 'logoLightMode', 'logoDarkMode')
 * export class UpdateBrandDTO {
 *   // undefined  → field not sent       → skipped by ValidateIf, not updated
 *   // null       → field explicitly null → passes IsOptional, updated to null
 *   // "value"    → field has a value     → validated by IsMongoId, updated
 *
 *   @ValidateIf((o) => o.description !== undefined)
 *   @IsOptional()
 *   @IsString()
 *   description?: string | null;
 *
 *   @ValidateIf((o) => o.logoLightMode !== undefined)
 *   @IsOptional()
 *   @IsMongoId()
 *   logoLightMode?: string | null;
 * }
 * ```
 *
 * @see {@link KEEP_NULL_FIELDS_KEY} - Metadata key read by `StrictValidationPipe`
 * @see {@link StrictValidationPipe} - Pipe that consumes this metadata to preserve null fields
 * @see {@link cleanObject} - Utility that performs the actual field filtering
 */

export const KeepNullFields = (...fields: string[]) =>
  SetMetadata(KEEP_NULL_FIELDS_KEY, fields);
