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
import { MediaFolderController } from './presentation/media-folder.controller';
import { MediaController } from './presentation/media.controller';
import { BrandModule } from '@modules/brand/brand.module';
import { BrandReaderImpl } from './infrastructure/readers';

@Module({
  imports: [
    CloudinaryModule,
    JwtAccessTokenModule,
    MongooseModule.forFeature([MediaSchemaModel, MediaFolderSchemaModel]),
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
      provide: MediaUsageReader,
      useFactory: (...readers: MediaUsageReader[]) => readers,
      inject: [BRAND_READER],
    },
    GetAllMediaFolderUseCase,
    CreateMediaFolderUseCase,
    UploadImageMediaUseCase,
    DeleteImageMediaUseCase,
    GetAllMediaUseCase,
  ],
  controllers: [MediaController, MediaFolderController],
})
export class MediaModule {}
