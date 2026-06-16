import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandSchemaModel } from '../shared/infrastructure/persistence/schema';
import {
  CreateBrandUseCase,
  RestoreBrandUseCase,
  SoftDeleteBrandUseCase,
  GetBySlugUseCase,
  GetAllBrandUseCase,
  ChangeActiveBrandUseCase,
  UpdateBrandUseCase,
} from './application/use-case';
import { BRAND_REPOSITORY } from '../shared/domain/ports';
import { BrandRepositoryImpl } from '../shared/infrastructure/persistence/repository';
import { AdminBrandController } from './presentation/admin-brand.controller';
import { JwtAccessTokenModule } from '@shared/infrastructure';
import { UPLOAD_BRAND_BANNER_SIGNED_SERVICE } from './domain/ports';
import { UploadBannerSignedServiceImpl } from './infrastructure/upload-banner-signed/upload-banner-signed.service.impl';
import { CloudinaryModule } from '@shared/infrastructure/cloudinary';
import { MediaSchemaModel } from '@modules/media/infrastructure/persistence/schema';
import { MEDIA_READER } from './domain/ports/readers';
import { MediaReaderImpl } from './infrastructure/readers/media.reader.impl';

@Module({
  imports: [
    MongooseModule.forFeature([BrandSchemaModel, MediaSchemaModel]),
    JwtAccessTokenModule,
    CloudinaryModule,
  ],
  providers: [
    CreateBrandUseCase,
    SoftDeleteBrandUseCase,
    RestoreBrandUseCase,
    GetBySlugUseCase,
    GetAllBrandUseCase,
    ChangeActiveBrandUseCase,
    UpdateBrandUseCase,
    { provide: BRAND_REPOSITORY, useClass: BrandRepositoryImpl },
    {
      provide: UPLOAD_BRAND_BANNER_SIGNED_SERVICE,
      useClass: UploadBannerSignedServiceImpl,
    },
    {
      provide: MEDIA_READER,
      useClass: MediaReaderImpl,
    },
  ],
  controllers: [AdminBrandController],
  exports: [],
})
export class AdminBrandModule {}
