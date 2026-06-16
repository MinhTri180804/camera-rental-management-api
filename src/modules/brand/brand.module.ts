import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AdminBrandModule } from './admin/admin-brand.module';
import { ClientBrandModule } from './client/client-brand.module';
import { BrandSchemaModel } from './shared/infrastructure/persistence/schema';

@Module({
  imports: [
    MongooseModule.forFeature([BrandSchemaModel]),
    AdminBrandModule,
    ClientBrandModule,
  ],
  providers: [],
  controllers: [],
  exports: [MongooseModule],
})
export class BrandModule {}
