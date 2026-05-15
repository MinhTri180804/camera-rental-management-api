import { Module } from '@nestjs/common';
import { DeliveryInformationController } from './presentation/delivery-information.controller';
import { LocationModule } from '@modules/locations/location.module';
import { MongooseModule } from '@nestjs/mongoose';
import { DeliveryInformationSchemaModel } from './infrastructure/persistence/schema';
import { JwtAccessTokenModule } from '@shared/infrastructure';
import { DELIVERY_INFORMATION_REPOSITORY } from './domain/ports/repositories';
import { DeliveryInformationRepositoryImpl } from './infrastructure/persistence/repository';
import { PROVINCES_READER, WARDS_READER } from './domain/ports/readers';
import { ProvincesReaderImpl, WardsReaderImpl } from './infrastructure/readers';
import {
  GetAllMeDeliveryInformationUseCase,
  CreateDeliveryInformationUseCase,
  DeleteMeDeliveryInformationUseCase,
  UpdateMeDeliveryInformationUseCase,
  GetMeDeliveryInformationByIdUseCase,
} from './application/use-case';

@Module({
  imports: [
    LocationModule,
    MongooseModule.forFeature([DeliveryInformationSchemaModel]),
    JwtAccessTokenModule,
  ],
  controllers: [DeliveryInformationController],
  providers: [
    {
      provide: DELIVERY_INFORMATION_REPOSITORY,
      useClass: DeliveryInformationRepositoryImpl,
    },
    {
      provide: PROVINCES_READER,
      useClass: ProvincesReaderImpl,
    },
    {
      provide: WARDS_READER,
      useClass: WardsReaderImpl,
    },
    CreateDeliveryInformationUseCase,
    GetAllMeDeliveryInformationUseCase,
    DeleteMeDeliveryInformationUseCase,
    UpdateMeDeliveryInformationUseCase,
    GetMeDeliveryInformationByIdUseCase,
  ],
  exports: [],
})
export class DeliveryInformationModule {}
