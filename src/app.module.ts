import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@config/config.module';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { CacheModule } from '@shared/infrastructure/cache/cache.module';
import { AuthModule } from '@modules/auth/presentation/auth.module';

@Module({
  imports: [ConfigModule, DatabaseModule, CacheModule, AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
