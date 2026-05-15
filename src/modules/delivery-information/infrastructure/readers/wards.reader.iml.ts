import { WardEntity } from '@modules/delivery-information/domain/entities';
import { IWardsReader } from '@modules/delivery-information/domain/ports/readers';
import { WardsSchemaClass } from '@modules/locations/infrastructure/persistence/schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { WardMapper } from '../persistence/mapper';

@Injectable()
export class WardsReaderImpl implements IWardsReader {
  constructor(
    @InjectModel(WardsSchemaClass.name)
    private readonly _wardsModel: Model<WardsSchemaClass>,
  ) {}

  async isExist({
    code,
    name,
  }: {
    code: number;
    name: string;
  }): Promise<boolean> {
    const ward = await this._wardsModel.exists({ code, name });
    return !!ward;
  }

  async findByCodeAndProvinceCode(
    code: number,
    provinceCode: number,
  ): Promise<WardEntity | null> {
    const ward = await this._wardsModel.findOne({
      code,
      province_code: provinceCode,
    });
    return ward ? WardMapper.toDomain(ward) : null;
  }
}
