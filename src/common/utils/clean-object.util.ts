type CleanObjectParams = {
  object: object;
  includeUndefined?: boolean;
  keepNullFields?: string[];
};
export function cleanObject({
  object,
  keepNullFields = [],
  includeUndefined = true,
}: CleanObjectParams) {
  return Object.fromEntries(
    Object.entries(object).filter(([key, value]) => {
      if (value === undefined && !includeUndefined) {
        return false;
      }

      if (value === null && !keepNullFields.includes(key)) {
        return false;
      }

      return true;
    }),
  );
}
