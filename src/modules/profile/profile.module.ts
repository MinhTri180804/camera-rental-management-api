import { Module } from '@nestjs/common';
import { CreateProfileModule } from './create/create-profile.module';

@Module({
  imports: [CreateProfileModule],
  providers: [],
  exports: [],
})
export class ProfileModule {}
