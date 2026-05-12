/* eslint-disable @typescript-eslint/no-floating-promises */
import { ProvincesSchemaClass } from '@modules/locations/infrastructure/persistence/schema/provinces.schema';
import { NestFactory } from '@nestjs/core';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AppModule } from 'src/app.module';
import provinces from '../../dataset/v2/provinces.json';
import { normalizedName } from '@common/utils';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const provinceModel = app.get<Model<ProvincesSchemaClass>>(
    getModelToken(ProvincesSchemaClass.name),
  );

  const operations = provinces.map((province) => ({
    updateOne: {
      filter: {
        code: province.code,
      },

      update: {
        $set: {
          name: province.name,

          normalized_name: normalizedName(province.name),

          code: province.code,

          division_type: province.division_type,

          code_name: province.codename,

          phone_code: province.phone_code,
        },
      },

      upsert: true,
    },
  }));

  await provinceModel.bulkWrite(operations);

  console.log('Seed provinces success');

  await app.close();
}

bootstrap();
