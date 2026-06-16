/**
 * Extracts IDs of entities that have a conflicting slug,
 * optionally excluding a specific entity (e.g. the one being updated).
 *
 * @param existingEntities - List of entities that currently have the slug
 * @param excludeId - ID of the entity to exclude from conflict check (optional, use on update)
 * @returns Array of conflicting entity IDs
 *
 * @example
 * // On create (no excludeId)
 * const brands = await repository.getAllBySlug("nokia");
 * const conflictIds = getSlugConflictIds(brands);
 * if (conflictIds.length > 0) throw new BrandSlugExistsException("nokia", conflictIds);
 *
 * @example
 * // On update (exclude current entity)
 * const brands = await repository.getAllBySlug("nokia");
 * const conflictIds = getSlugConflictIds(brands, brand.id);
 * if (conflictIds.length > 0) throw new BrandSlugExistsException("nokia", conflictIds);
 */
export function getConflictSlugIds(
  existingEntities: { id: string }[],
  excludeId?: string,
) {
  return existingEntities.reduce((acc, entity) => {
    if (entity.id !== excludeId) acc.push(entity.id);
    return acc;
  }, [] as string[]);
}
