import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@config/config.module';
import { DatabaseModule } from '@shared/infrastructure/database/database.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ProfileModule } from '@modules/profile/profile.module';
import { LocationModule } from '@modules/locations/location.module';
import { DeliveryInformationModule } from '@modules/delivery-information/delivery-information.module';
import { BrandModule } from '@modules/brand/brand.module';
import { BullBoardModule } from '@bull-board/nestjs';
import { ExpressAdapter } from '@bull-board/express';
import { MediaModule } from '@modules/media/media.module';

@Module({
  imports: [
    BullBoardModule.forRoot({
      route: '/admin/queues',
      adapter: ExpressAdapter,
    }),
    ConfigModule,
    DatabaseModule,
    AuthModule,
    ProfileModule,
    LocationModule,
    DeliveryInformationModule,
    BrandModule,
    MediaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
