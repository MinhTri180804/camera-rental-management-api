import { Module } from '@nestjs/common';
import { JwtAccessTokenModule } from '@shared/infrastructure';
import { JwtRefreshTokenModule } from '../refresh-token';
import { JWT_SERVICE_TOKEN } from '../../domain';
import { JwtServiceIml } from './jwt.service';

@Module({
  imports: [JwtAccessTokenModule, JwtRefreshTokenModule],
  providers: [{ provide: JWT_SERVICE_TOKEN, useClass: JwtServiceIml }],
  exports: [JWT_SERVICE_TOKEN],
})
export class JWTModule {}
