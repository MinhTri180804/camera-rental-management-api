import { Module } from '@nestjs/common';
import { CreateProfileModule } from './create/create-profile.module';
import { UpdateProfileModule } from './update/update-profile.module';
import { GetProfileModule } from './get/get-profile.module';

@Module({
  imports: [CreateProfileModule, UpdateProfileModule, GetProfileModule],
  providers: [],
  exports: [],
})
export class ProfileModule {}
