import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BrandSchemaModel } from '../shared/infrastructure/persistence/schema';
import {
  GetAllBrandUseCase,
  GetBrandBySlugUseCase,
} from './application/use-case';
import { BRAND_REPOSITORY } from '../shared/domain/ports';
import { BrandRepositoryImpl } from '../shared/infrastructure/persistence/repository';
import { ClientBrandController } from './presentation/client-brand.controller';

@Module({
  imports: [MongooseModule.forFeature([BrandSchemaModel])],
  providers: [
    GetAllBrandUseCase,
    GetBrandBySlugUseCase,
    {
      provide: BRAND_REPOSITORY,
      useClass: BrandRepositoryImpl,
    },
  ],
  controllers: [ClientBrandController],
  exports: [],
})
export class ClientBrandModule {}
