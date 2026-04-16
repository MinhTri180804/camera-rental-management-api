type CleanObjectParams = {
  object: object;
  includeNull?: boolean;
  includeUndefined?: boolean;
};
export function cleanObject({
  object,
  includeNull = false,
  includeUndefined = true,
}: CleanObjectParams) {
  for (const key of Object.keys(object)) {
    if ((includeNull || includeUndefined) && !object[key]) delete object[key];
  }

  return object;
}
