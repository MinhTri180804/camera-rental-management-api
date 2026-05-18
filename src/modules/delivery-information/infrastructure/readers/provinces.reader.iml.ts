import { ProvinceEntity } from '@modules/delivery-information/domain/entities';
import { IProvincesReader } from '@modules/delivery-information/domain/ports/readers';
import { ProvincesSchemaClass } from '@modules/locations/infrastructure/persistence/schema';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProvinceMapper } from '../persistence/mapper';

@Injectable()
export class ProvincesReaderImpl implements IProvincesReader {
  constructor(
    @InjectModel(ProvincesSchemaClass.name)
    private readonly _provincesModel: Model<ProvincesSchemaClass>,
  ) {}

  async isExist({
    code,
    name,
  }: {
    code: number;
    name: string;
  }): Promise<boolean> {
    const province = await this._provincesModel.exists({ code, name });
    return !!province;
  }

  async findByCode(code: number): Promise<ProvinceEntity | null> {
    const province = await this._provincesModel.findOne({ code });
    return province ? ProvinceMapper.toDomain(province) : null;
  }
}
