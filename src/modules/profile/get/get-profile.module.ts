import { Module } from '@nestjs/common';
import { GetProfileController } from './presentation';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtAccessTokenModule,
  ProfileSchemaModel,
} from '@shared/infrastructure';
import { PROFILE_REPOSITORY_TOKEN } from '../shared/domain/ports';
import { ProfileRepositoryIml } from '../shared/infrastructure';
import { GetMeProfileUseCase } from './application/use-case';

@Module({
  controllers: [GetProfileController],
  imports: [
    MongooseModule.forFeature([ProfileSchemaModel]),
    JwtAccessTokenModule,
  ],
  providers: [
    {
      provide: PROFILE_REPOSITORY_TOKEN,
      useClass: ProfileRepositoryIml,
    },
    GetMeProfileUseCase,
  ],
  exports: [],
})
export class GetProfileModule {}
