import { Module } from '@nestjs/common';
import { CreateProfileModule } from './create/create-profile.module';
import { GetProfileModule } from './get/get-profile.module';
import { UpdateProfileModule } from './update/update-profile.module';
import { UploadProfileModule } from './upload/upload-profile.module';

@Module({
  imports: [
    CreateProfileModule,
    UpdateProfileModule,
    GetProfileModule,
    UploadProfileModule,
  ],
  providers: [],
  exports: [],
})
export class ProfileModule {}
