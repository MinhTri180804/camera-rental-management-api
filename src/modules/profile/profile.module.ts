import { Module } from '@nestjs/common';
import { CreateProfileModule } from './create/create-profile.module';
import { UpdateProfileModule } from './update/update-profile.module';

@Module({
  imports: [CreateProfileModule, UpdateProfileModule],
  providers: [],
  exports: [],
})
export class ProfileModule {}
