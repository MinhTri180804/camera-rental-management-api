import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchemaModel } from '@shared/infrastructure';
import { USER_REPOSITORY_TOKEN } from '../shared/domain';
import { JWTModule, UserRepositoryImpl } from '../shared/infrastructure';
import { LoginUseCase } from './application';
import { AuthLoginController } from './presentation';

@Module({
  imports: [MongooseModule.forFeature([UserSchemaModel]), JWTModule],
  providers: [
    LoginUseCase,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepositoryImpl,
    },
  ],
  controllers: [AuthLoginController],
  exports: [],
})
export class AuthLoginModule {}
