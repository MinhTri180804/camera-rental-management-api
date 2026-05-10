import { Module } from '@nestjs/common';
import { UploadProfileController } from './presentation';
import { UploadAvatarSignatureUseCase } from './application/use-case';
import { CloudinaryModule } from '@shared/infrastructure/cloudinary';
import { UPLOAD_AVATAR_SIGNED_SERVICE } from './domain/ports';
import { UploadAvatarSignedServiceIml } from './infrastructure/upload-avatar-signed';
import { JwtAccessTokenModule } from '@shared/infrastructure';

@Module({
  imports: [CloudinaryModule, JwtAccessTokenModule],
  controllers: [UploadProfileController],
  providers: [
    UploadAvatarSignatureUseCase,
    {
      provide: UPLOAD_AVATAR_SIGNED_SERVICE,
      useClass: UploadAvatarSignedServiceIml,
    },
  ],
  exports: [],
})
export class UploadProfileModule {}
