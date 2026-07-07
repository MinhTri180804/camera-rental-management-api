import { ClassificationType } from '@modules/category/shared/presentation/constants';
import { AncestorEntity } from './ancestor.entity';

import { SeoEntity } from './seo.entity';
import {
  BooleanSpecSchemaEntity,
  RangeSpecSchemaEntity,
  SelectSpecSchemaEntity,
  TextSpecSchemaEntity,
} from './spec-schema.entity';
import { MediaEntity } from './media.entity';

export class CategoryEntity {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  parentId: string | null;
  ancestors: AncestorEntity[];
  level: number;
  path: string;
  image: MediaEntity | string | null;
  icon: MediaEntity | null | string;
  banners: MediaEntity[] | string[];
  sortOrder: number;
  isActive: boolean;
  classificationType: ClassificationType;
  brandRef: string | null;
  // compatibilityWith: string[];
  seo: SeoEntity;
  inheritSpecs: boolean;
  specsSchema: (
    | SelectSpecSchemaEntity
    | RangeSpecSchemaEntity
    | BooleanSpecSchemaEntity
    | TextSpecSchemaEntity
  )[];
  productCount: number;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
}
