import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ProvincesSchemaModel,
  WardsSchemaModel,
} from './infrastructure/persistence/schema';
import { LocationController } from './presentation/location.controller';
import { PROVINCES_REPOSITORY, WARDS_REPOSITORY } from './domain/ports';
import {
  ProvincesRepositoryImpl,
  WardsRepositoryImpl,
} from './infrastructure/persistence/repository';
import {
  GetAllProvincesUseCase,
  GetAllWardsByProvinceUseCase,
} from './application/use-case';
import { JwtAccessTokenModule } from '@shared/infrastructure';

@Module({
  controllers: [LocationController],
  imports: [
    MongooseModule.forFeature([ProvincesSchemaModel, WardsSchemaModel]),
    JwtAccessTokenModule,
  ],
  providers: [
    {
      provide: PROVINCES_REPOSITORY,
      useClass: ProvincesRepositoryImpl,
    },
    {
      provide: WARDS_REPOSITORY,
      useClass: WardsRepositoryImpl,
    },
    GetAllProvincesUseCase,
    GetAllWardsByProvinceUseCase,
  ],
  exports: [MongooseModule],
})
export class LocationModule {}
