import { BrandModule } from '@modules/brand/brand.module';
import { CategoriesSchemaModel } from '@modules/category/shared/infrastructure/persistence/schema';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtAccessTokenModule } from '@shared/infrastructure';
import { CloudinaryModule } from '@shared/infrastructure/cloudinary';
import {
  CreateMediaFolderUseCase,
  DeleteImageMediaUseCase,
  GetAllMediaFolderUseCase,
  GetAllMediaUseCase,
  UploadImageMediaUseCase,
} from './application/usecase';
import {
  BRAND_READER,
  CATEGORY_MEDIA_USAGE_READER,
  MEDIA_FOLDER_REPOSITORY,
  MEDIA_REPOSITORY,
  MEDIA_STORAGE_SERVICE,
  MEDIA_USAGE_SERVICE,
  MediaUsageReader,
} from './domain/ports';
import { MediaStorageServiceImpl } from './infrastructure/media-storage.service.impl';
import { MediaUsageServiceImpl } from './infrastructure/media-usage.service.impl';
import {
  MediaFolderRepositoryImpl,
  MediaRepositoryImpl,
} from './infrastructure/persistence/repository';
import {
  MediaFolderSchemaModel,
  MediaSchemaModel,
} from './infrastructure/persistence/schema';
import {
  BrandReaderImpl,
  CategoryMediaUsageReaderImpl,
} from './infrastructure/readers';
import { MediaFolderController } from './presentation/media-folder.controller';
import { MediaController } from './presentation/media.controller';

@Module({
  imports: [
    CloudinaryModule,
    JwtAccessTokenModule,
    MongooseModule.forFeature([
      MediaSchemaModel,
      MediaFolderSchemaModel,
      CategoriesSchemaModel,
    ]),
    BrandModule,
  ],
  providers: [
    {
      provide: MEDIA_FOLDER_REPOSITORY,
      useClass: MediaFolderRepositoryImpl,
    },
    {
      provide: MEDIA_REPOSITORY,
      useClass: MediaRepositoryImpl,
    },
    {
      provide: MEDIA_STORAGE_SERVICE,
      useClass: MediaStorageServiceImpl,
    },
    {
      provide: MEDIA_USAGE_SERVICE,
      useClass: MediaUsageServiceImpl,
    },
    {
      provide: BRAND_READER,
      useClass: BrandReaderImpl,
    },
    {
      provide: CATEGORY_MEDIA_USAGE_READER,
      useClass: CategoryMediaUsageReaderImpl,
    },
    {
      provide: MediaUsageReader,
      useFactory: (...readers: MediaUsageReader[]) => readers,
      inject: [BRAND_READER, CATEGORY_MEDIA_USAGE_READER],
    },
    GetAllMediaFolderUseCase,
    CreateMediaFolderUseCase,
    UploadImageMediaUseCase,
    DeleteImageMediaUseCase,
    GetAllMediaUseCase,
  ],
  controllers: [MediaController, MediaFolderController],
  exports: [MongooseModule],
})
export class MediaModule {}
