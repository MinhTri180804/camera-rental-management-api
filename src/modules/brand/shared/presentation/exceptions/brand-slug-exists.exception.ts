import { DomainException } from '@shared/presentation';

export class BrandSlugExistsException extends DomainException {
  static readonly ERROR_CODE = 'BRAND_SLUG_EXISTS';
  constructor(slugExists: string, brandIdConflictSlug: string[]) {
    const MESSAGE = `Cannot restore: slug '${slugExists}' is already taken by another brand. Please restore with a new slug.`;
    super(BrandSlugExistsException.ERROR_CODE, MESSAGE, [
      {
        field: 'slug',
        message: [`${slugExists} is already`],
        brandIdConflictSlug,
      },
    ]);
  }
}
