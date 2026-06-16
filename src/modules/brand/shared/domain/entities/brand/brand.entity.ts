import { MediaEntity } from './media.entity';
import { SeoEntity } from './seo.entity';

export class BrandEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  logoDarkMode: string | MediaEntity | null;
  logoLightMode: string | MediaEntity | null;
  banners: MediaEntity[] | string[];
  originCountry: string | null;
  websiteUrl: string | null;
  isActive: boolean;
  seo: SeoEntity;
  productCount: number;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
  isDeleted: boolean;
  createdBy: string;
}
