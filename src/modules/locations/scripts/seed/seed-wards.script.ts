/* eslint-disable @typescript-eslint/no-floating-promises */
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { AppModule } from 'src/app.module';
import { WardsSchemaClass } from '../../infrastructure/persistence/schema/wards.schema';
import { Model } from 'mongoose';
import wards from '../../dataset/v2/wards.json';
import { normalizedName } from '@common/utils';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const wardModel = app.get<Model<WardsSchemaClass>>(
    getModelToken(WardsSchemaClass.name),
  );

  await wardModel.deleteMany({});

  await wardModel.insertMany(
    wards.map((ward) => ({
      code: ward.code,
      name: ward.name,

      normalized_name: normalizedName(ward.name),

      division_type: ward.division_type,

      code_name: ward.codename,

      province_code: ward.province_code,
    })),
  );

  console.log('Seed wards success');

  await app.close();
}

bootstrap();
