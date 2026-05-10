import { Module } from '@nestjs/common';
import { UpdateProfileController } from './presentation/update-profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import {
  JwtAccessTokenModule,
  ProfileSchemaModel,
} from '@shared/infrastructure';
import { PROFILE_REPOSITORY_TOKEN } from '../shared/domain/ports';
import { ProfileRepositoryIml } from '../shared/infrastructure';
import {
  UpdateAvatarUseCase,
  UpdateProfileUseCase,
} from './application/use-case';

@Module({
  controllers: [UpdateProfileController],
  imports: [
    MongooseModule.forFeature([ProfileSchemaModel]),
    JwtAccessTokenModule,
  ],
  providers: [
    { provide: PROFILE_REPOSITORY_TOKEN, useClass: ProfileRepositoryIml },
    UpdateProfileUseCase,
    UpdateAvatarUseCase,
  ],
  exports: [],
})
export class UpdateProfileModule {}
