/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

/**
 * Flattens a nested object into a single-level object with dot notation keys.
 *
 * - Recursively flattens nested objects
 * - Preserves `null` values (treats as leaf node, not recursed into)
 * - Skips `undefined` values
 * - Preserves arrays as-is (not flattened)
 *
 * @param obj - The object to flatten
 * @param prefix - (Internal) Dot notation prefix built up during recursion
 * @returns A single-level object with dot notation keys
 *
 * @example
 * flattenObject({ name: "Nokia", seo: { title: "ABC", keywords: null } })
 * // → { "name": "Nokia", "seo.title": "ABC", "seo.keywords": null }
 *
 * @example
 * // Useful for MongoDB partial updates with $set — prevents overwriting sibling fields
 * const flatData = flattenObject(data);
 * await model.findByIdAndUpdate(id, { $set: flatData });
 */
export function flattenObject(
  obj: Record<string, any>,
  prefix = '',
): Record<string, any> {
  return Object.entries(obj).reduce(
    (acc, [key, value]) => {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        value !== null &&
        value !== undefined &&
        typeof value === 'object' &&
        !Array.isArray(value)
      ) {
        // Nested object → recurse deeper
        Object.assign(acc, flattenObject(value, newKey));
      } else {
        // Primitive, null, or array → assign as leaf
        acc[newKey] = value;
      }

      return acc;
    },
    {} as Record<string, any>,
  );
}
