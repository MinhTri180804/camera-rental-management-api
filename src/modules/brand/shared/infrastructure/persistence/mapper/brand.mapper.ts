import {
  BrandEntity,
  MediaEntity,
  SeoEntity,
} from '@modules/brand/shared/domain/entities/brand';
import { MediaLearn } from '@modules/media/infrastructure/persistence/schema';
import { Types } from 'mongoose';
import { BrandDocument } from '../schema';

export class BrandMapper {
  static toDomain({
    brandDocument,
    options = {
      populate: {
        banners: false,
      },
    },
  }: {
    brandDocument: BrandDocument;
    options?: {
      populate: {
        banners?: boolean;
      };
    };
  }): BrandEntity {
    const brandEntity = new BrandEntity();

    // Map brand entity
    brandEntity.id = brandDocument._id.toString();
    brandEntity.name = brandDocument.name;
    brandEntity.slug = brandDocument.slug;
    brandEntity.description = brandDocument.description;
    brandEntity.logoDarkMode = this._mapMediaDomain(
      brandDocument.logo_dark_mode,
    );
    brandEntity.logoLightMode = this._mapMediaDomain(
      brandDocument.logo_light_mode,
    );
    brandEntity.banners = options.populate.banners
      ? this._mapBannerDomain(brandDocument.banners as MediaLearn[])
      : (brandDocument.banners as Types.ObjectId[]).map((banner) =>
          banner.toString(),
        );
    brandEntity.originCountry = brandDocument.origin_country;
    brandEntity.websiteUrl = brandDocument.website_url;
    brandEntity.isActive = brandDocument.is_active;
    brandEntity.seo = this._mapSeoDomain(brandDocument.seo);
    brandEntity.productCount = brandDocument.product_count;
    brandEntity.createdAt = brandDocument.createdAt;
    brandEntity.updatedAt = brandDocument.updatedAt;
    brandEntity.deletedAt = brandDocument.deleted_at;
    brandEntity.isDeleted = brandDocument.is_deleted;
    brandEntity.createdBy = brandDocument.created_by.toString();
    return brandEntity;
  }

  static toPersistence(
    brandEntity: Partial<BrandEntity>,
  ): Partial<BrandDocument> {
    return {
      name: brandEntity.name,
      slug: brandEntity.slug,
      description: brandEntity.description,
      logo_dark_mode: brandEntity.logoDarkMode
        ? new Types.ObjectId(brandEntity.logoDarkMode as string)
        : null,

      logo_light_mode: brandEntity.logoLightMode
        ? new Types.ObjectId(brandEntity.logoLightMode as string)
        : null,

      banners: brandEntity.banners
        ? this._mapBannerPersistence(brandEntity.banners as string[])
        : [],
      origin_country: brandEntity.originCountry,
      website_url: brandEntity.websiteUrl,
      is_active: brandEntity.isActive,
      seo: this._mapSeoPersistence(brandEntity.seo!),
      product_count: brandEntity.productCount,
      deleted_at: brandEntity.deletedAt,
      is_deleted: brandEntity.isDeleted,
      created_by: new Types.ObjectId(brandEntity.createdBy),
    };
  }

  private static _mapBannerDomain(banners: MediaLearn[]) {
    return banners.map((banner) => {
      return {
        id: banner._id.toString(),
        publicId: banner.public_id,
        alt: banner.alt,
        type: banner.type,
        createdAt: banner.createdAt,
        updatedAt: banner.updatedAt,
      };
    });
  }

  private static _mapMediaDomain(
    media: MediaLearn | null | Types.ObjectId,
  ): MediaEntity | null | string {
    if (!media) {
      return null;
    }

    if (media instanceof Types.ObjectId) {
      return media.toString();
    }

    return {
      id: media._id.toString(),
      publicId: media.public_id,
      alt: media.alt,
      type: media.type,
      createdAt: media.createdAt,
      updatedAt: media.updatedAt,
    };
  }

  private static _mapSeoDomain(seo: BrandDocument['seo']): SeoEntity {
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
    };
  }

  private static _mapSeoPersistence(seo: SeoEntity): BrandDocument['seo'] {
    return {
      title: seo.title,
      description: seo.description,
      keywords: seo.keywords,
    };
  }

  private static _mapBannerPersistence(mediaIds: string[]): Types.ObjectId[] {
    return mediaIds.map((media) => new Types.ObjectId(media));
  }
}
