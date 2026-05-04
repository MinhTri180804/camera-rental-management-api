import { Module } from '@nestjs/common';
import {
  JwtAccessTokenModule,
  ProfileSchemaModel,
} from '@shared/infrastructure';
import { CreateProfileUseCase } from './application/use-case';
import { CreateProfileController } from './presentation/create-profile.controller';
import { PROFILE_REPOSITORY_TOKEN } from '../shared/domain/ports';
import { ProfileRepositoryIml } from '../shared/infrastructure';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  controllers: [CreateProfileController],
  imports: [
    JwtAccessTokenModule,
    MongooseModule.forFeature([ProfileSchemaModel]),
  ],
  providers: [
    CreateProfileUseCase,
    { provide: PROFILE_REPOSITORY_TOKEN, useClass: ProfileRepositoryIml },
  ],
  exports: [],
})
export class CreateProfileModule {}
