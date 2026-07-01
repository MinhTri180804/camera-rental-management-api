/* eslint-disable no-case-declarations */
import { PartialOmitWithRequired } from '@common/types';
import {
  AncestorEntity,
  BooleanSpecSchemaEntity,
  CategoryEntity,
  MediaEntity,
  RangeSpecSchemaEntity,
  SelectSpecSchemaEntity,
  SeoEntity,
  SpecSchemaBaseEntity,
  TextSpecSchemaEntity,
} from '@modules/category/shared/domain/entities/category';
import { SPEC_TYPE } from '@modules/category/shared/presentation/constants';
import { SpecSchema } from '@modules/category/shared/presentation/types';
import { MediaLearn } from '@modules/media/infrastructure/persistence/schema';
import { Types } from 'mongoose';
import { CategoryDocument } from '../schema';
import { CategoryLearn } from '../schema/categories.schema';

export class CategoryMapper {
  static toDomain(document: CategoryLearn): CategoryEntity {
    const entity = new CategoryEntity();
    entity.id = document._id.toString();
    entity.name = document.name;
    entity.slug = document.slug;
    entity.description = document.description;
    entity.parentId = document.parent_id?.toString() || null;
    entity.ancestors = this._ancestorMapperDomain(document.ancestors);
    entity.level = document.level;
    entity.path = document.path;
    entity.image = this._mediaMapperDomain(document.image);
    entity.icon = this._mediaMapperDomain(document.icon);
    entity.banners = this._bannerMapperDomain(document.banners);
    entity.sortOrder = document.sort_order;
    entity.isActive = document.is_active;
    entity.classificationType = document.classification_type;
    entity.brandRef = document.brand_ref?.toString() || null;
    // entity.compatibilityWith = document.compatible_with;
    entity.seo = new SeoEntity(
      document.seo.title,
      document.seo.description,
      document.seo.keywords,
    );
    entity.inheritSpecs = document.inherit_specs;
    entity.specsSchema = this._specSchemaMapperDomain(document.specs_schema);
    entity.productCount = document.product_count;
    entity.createdAt = document.createdAt;
    entity.updatedAt = document.updatedAt;
    entity.deletedAt = document.deleted_at;
    entity.isDeleted = document.is_deleted;
    entity.createdBy = document.created_by.toString();
    return entity;
  }

  static toPersistence(
    entity: PartialOmitWithRequired<
      CategoryEntity,
      | 'id'
      | 'createdAt'
      | 'updatedAt'
      | 'deletedAt'
      | 'isDeleted'
      | 'productCount',
      'name' | 'slug' | 'path' | 'classificationType' | 'seo' | 'createdBy'
    >,
  ): Partial<CategoryDocument> {
    console.log('[CREATED_BY]: ', entity.createdBy);

    return {
      name: entity.name,
      slug: entity.slug,
      description: entity.description,
      parent_id: entity.parentId ? new Types.ObjectId(entity.parentId) : null,
      ancestors: entity.ancestors
        ? this._ancestorMapperPersistence(entity.ancestors)
        : [],
      level: entity.level,
      path: entity.path,
      image: entity.image ? new Types.ObjectId(entity.image as string) : null,
      icon: entity.icon ? new Types.ObjectId(entity.icon as string) : null,
      banners: entity.banners
        ? entity.banners.map((banner) => new Types.ObjectId(banner as string))
        : [],
      sort_order: entity.sortOrder,
      is_active: entity.isActive,
      classification_type: entity.classificationType,
      brand_ref: entity.brandRef ? new Types.ObjectId(entity.brandRef) : null,
      // compatible_with: entity.compatibilityWith,
      seo: {
        title: entity.seo.title,
        description: entity.seo.description,
        keywords: entity.seo.keywords,
      },
      inherit_specs: entity.inheritSpecs,

      specs_schema: entity.specsSchema
        ? this._specSchemaMapperPersistence(entity.specsSchema)
        : [],
      created_by: new Types.ObjectId(entity.createdBy),
    };
  }

  static toAncestorsPersistence(
    ancestors: AncestorEntity[],
  ): CategoryDocument['ancestors'] {
    return ancestors.map((ancestor) => ({
      _id: new Types.ObjectId(ancestor.id),
      name: ancestor.name,
      slug: ancestor.slug,
    }));
  }

  private static _specSchemaMapperDomain(
    specsSchemaDocument: CategoryDocument['specs_schema'],
  ): (
    | SelectSpecSchemaEntity
    | RangeSpecSchemaEntity
    | BooleanSpecSchemaEntity
    | TextSpecSchemaEntity
  )[] {
    const result: (
      | SelectSpecSchemaEntity
      | RangeSpecSchemaEntity
      | BooleanSpecSchemaEntity
      | TextSpecSchemaEntity
    )[] = [];

    specsSchemaDocument.forEach((specSchema) => {
      switch (specSchema.type) {
        case SPEC_TYPE.SELECT:
          const entity = new SelectSpecSchemaEntity();
          this._specSchemaBaseMapperDomain(specSchema, entity);
          entity.type = specSchema.type;
          entity.filterType = specSchema.filter_type;
          entity.options = specSchema.options;
          entity.multiple = specSchema.multiple;

          result.push(entity);
          break;

        case SPEC_TYPE.RANGE:
          const rangeEntity = new RangeSpecSchemaEntity();
          this._specSchemaBaseMapperDomain(specSchema, rangeEntity);
          rangeEntity.type = specSchema.type;
          rangeEntity.filterType = specSchema.filter_type;
          rangeEntity.min = specSchema.min;
          rangeEntity.max = specSchema.max;
          rangeEntity.step = specSchema.step;

          result.push(rangeEntity);
          break;

        case SPEC_TYPE.BOOLEAN:
          const booleanEntity = new BooleanSpecSchemaEntity();
          this._specSchemaBaseMapperDomain(specSchema, booleanEntity);
          booleanEntity.type = specSchema.type;
          booleanEntity.filterType = specSchema.filter_type;

          result.push(booleanEntity);
          break;

        case SPEC_TYPE.TEXT:
          const textEntity = new TextSpecSchemaEntity();
          textEntity.type = specSchema.type;
          textEntity.key = specSchema.key;
          textEntity.label = specSchema.label;
          textEntity.unit = specSchema.unit;
          textEntity.filterable = specSchema.filterable;
          textEntity.compareEnabled = specSchema.compare_enabled;
          textEntity.sortOrder = specSchema.sort_order;

          result.push(textEntity);
          break;
      }
    });

    return result;
  }

  private static _specSchemaMapperPersistence(
    specSchema: (
      | SelectSpecSchemaEntity
      | RangeSpecSchemaEntity
      | BooleanSpecSchemaEntity
      | TextSpecSchemaEntity
    )[],
  ): SpecSchema[] {
    const result: SpecSchema[] = [];
    specSchema.forEach((spec) => {
      switch (spec.type) {
        case SPEC_TYPE.SELECT:
          const selectSpec = {
            key: spec.key,
            label: spec.label,
            unit: spec.unit,
            filterable: spec.filterable,
            compare_enabled: spec.compareEnabled,
            sort_order: spec.sortOrder,
            type: spec.type,
            filter_type: spec.filterType,
            options: spec.options,
            multiple: spec.multiple,
          };

          result.push(selectSpec);
          break;

        case SPEC_TYPE.RANGE:
          const rangeSpec = {
            key: spec.key,
            label: spec.label,
            unit: spec.unit,
            filterable: spec.filterable,
            compare_enabled: spec.compareEnabled,
            sort_order: spec.sortOrder,
            type: spec.type,
            min: spec.min,
            max: spec.max,
            step: spec.step,
            filter_type: spec.filterType,
          };

          result.push(rangeSpec);

          break;

        case SPEC_TYPE.BOOLEAN:
          const booleanSpec = {
            key: spec.key,
            label: spec.label,
            unit: spec.unit,
            filterable: spec.filterable,
            compare_enabled: spec.compareEnabled,
            sort_order: spec.sortOrder,
            type: spec.type,
            filter_type: spec.filterType,
          };

          result.push(booleanSpec);
          break;

        case SPEC_TYPE.TEXT:
          const textSpec = {
            key: spec.key,
            label: spec.label,
            unit: spec.unit,
            filterable: spec.filterable,
            compare_enabled: spec.compareEnabled,
            sort_order: spec.sortOrder,
            type: spec.type,
            options: spec.options,
          };

          result.push(textSpec);
          break;
      }
    });
    return result;
  }

  private static _ancestorMapperDomain(
    ancestorsDocument: CategoryDocument['ancestors'],
  ): AncestorEntity[] {
    return ancestorsDocument.map((ancestor) => ({
      id: ancestor._id.toString(),
      name: ancestor.name,
      slug: ancestor.slug,
    }));
  }

  private static _ancestorMapperPersistence(
    ancestors: AncestorEntity[],
  ): CategoryDocument['ancestors'] {
    return ancestors.map((ancestor) => ({
      _id: new Types.ObjectId(ancestor.id),
      name: ancestor.name,
      slug: ancestor.slug,
    }));
  }

  private static _bannerMapperDomain(
    banners: (Types.ObjectId | MediaLearn)[],
  ): string[] | MediaEntity[] {
    if (banners.length === 0) return [];

    if (this._isObjectIdArray(banners)) {
      return banners.map((banner: Types.ObjectId) => banner.toString());
    }

    return (banners as MediaLearn[]).map((banner) => ({
      id: banner._id.toString(),
      alt: banner.alt,
      type: banner.type,
      publicId: banner.public_id,
      createdAt: banner.createdAt,
      updatedAt: banner.updatedAt,
    }));
  }

  private static _isObjectIdArray(
    arr: (Types.ObjectId | MediaLearn)[],
  ): arr is Types.ObjectId[] {
    return arr.length > 0 && arr[0] instanceof Types.ObjectId;
  }

  private static _specSchemaBaseMapperDomain(
    specsSchemaDocument: CategoryDocument['specs_schema'][0],
    entity: SpecSchemaBaseEntity,
  ): void {
    entity.key = specsSchemaDocument.key;
    entity.label = specsSchemaDocument.label;
    entity.unit = specsSchemaDocument.unit;
    entity.filterable = specsSchemaDocument.filterable;
    entity.compareEnabled = specsSchemaDocument.compare_enabled;
    entity.sortOrder = specsSchemaDocument.sort_order;
  }

  private static _mediaMapperDomain(
    media: null | Types.ObjectId | MediaLearn,
  ): null | MediaEntity | string {
    if (!media) return null;
    if (media instanceof Types.ObjectId) return media.toString();
    return {
      id: media._id.toString(),
      publicId: media.public_id,
      alt: media.alt,
      type: media.type,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }
}
