import {
  AncestorEntity,
  CategoryEntity,
} from '@modules/category/shared/domain/entities/category';
import {
  CATEGORY_REPOSITORY,
  type ICategoryRepository,
} from '@modules/category/shared/domain/ports';
import {
  type IMediaReader,
  MEDIA_READER,
} from '@modules/category/shared/domain/ports/reader';
import { CategorySpecsSchemaMapper } from '@modules/category/shared/infrastructure/persistence/mapper';
import { CLASSIFICATION_TYPE } from '@modules/category/shared/presentation/constants';
import {
  MediaNotFoundException,
  ParentCategoryNotFoundException,
} from '@modules/category/shared/presentation/exceptions';
import { Inject, Injectable } from '@nestjs/common';
import { slugify } from '@common/utils';
import { CreateCategoryDTO } from '../../dto';

type ExecuteParams = { dto: CreateCategoryDTO; userId: string };

@Injectable()
export class CreateCategoryUseCase {
  constructor(
    @Inject(CATEGORY_REPOSITORY)
    private readonly _categoryRepository: ICategoryRepository,

    @Inject(MEDIA_READER)
    private readonly _mediaReader: IMediaReader,
  ) {}

  async execute({ dto, userId }: ExecuteParams): Promise<CategoryEntity> {
    const ancestors: AncestorEntity[] = [];
    const specs = CategorySpecsSchemaMapper.toEntity(dto.specSchema);
    const slug = dto.slug ?? slugify(dto.name);
    let path = slug;
    let brandRef: string | null = null;

    if (dto.parentId) {
      const parent = await this._categoryRepository.getCategoryById(
        dto.parentId,
      );
      if (!parent) throw new ParentCategoryNotFoundException();

      ancestors.push(...parent.ancestors, {
        id: parent.id,
        slug: parent.slug,
        name: parent.name,
      });

      if (dto.inheritSpecs) {
        // TODO: Check duplicate spec schema
        specs.push(...parent.specsSchema);
      }

      path = `${parent.path}/${slug}`;
    }

    if (dto.image) {
      const imageMedia = await this._mediaReader.existsById(dto.image);
      if (!imageMedia)
        throw new MediaNotFoundException({
          fieldName: 'image',
          fieldValue: dto.image,
          messageFieldName: 'Image media not found',
        });
    }

    if (dto.icon) {
      const iconMedia = await this._mediaReader.existsById(dto.icon);
      if (!iconMedia)
        throw new MediaNotFoundException({
          fieldName: 'icon',
          fieldValue: dto.icon,
          messageFieldName: 'Icon media not found',
        });
    }

    if (dto.banners) {
      const bannerMediaExistsCheck = await Promise.all(
        dto.banners.map((bannerId) =>
          this._mediaReader
            .existsById(bannerId)
            .then((value) => value?.id.toString() || null),
        ),
      );

      const bannerMediaNotExists = bannerMediaExistsCheck.filter(
        (_, index) => !bannerMediaExistsCheck[index],
      );

      if (bannerMediaNotExists.length > 0) {
        throw new MediaNotFoundException({
          fieldName: 'banners',
          fieldValue: bannerMediaNotExists.join(','),
          messageFieldName: 'Banner media not found',
        });
      }
    }

    if (dto.classificationType === CLASSIFICATION_TYPE.BRAND) {
      brandRef = dto.brandRef;
    }

    const category = await this._categoryRepository.create({
      name: dto.name,
      slug: slug,
      description: dto.description,
      parentId: dto.parentId,
      ancestors: ancestors,
      level: ancestors.length,
      path: path,
      image: dto.image,
      icon: dto.icon,
      banners: dto.banners,
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
      classificationType: dto.classificationType,
      brandRef: brandRef,
      seo: dto.seo,
      inheritSpecs: dto.inheritSpecs,
      specsSchema: specs,
      createdBy: userId,
    });

    return category;
  }
}
