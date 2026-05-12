import { WardEntity } from '@modules/locations/domain/entities';
import { type IWardsRepository } from '@modules/locations/domain/ports';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { WardsSchemaClass } from '../schema';
import { Model, QueryFilter } from 'mongoose';
import { WardMapper } from '../mapper';

@Injectable()
export class WardsRepositoryImpl implements IWardsRepository {
  constructor(
    @InjectModel(WardsSchemaClass.name)
    private readonly _wardsRepository: Model<WardsSchemaClass>,
  ) {}

  async findByProvinceId(
    provinceId: number,
    normalizedName?: string,
  ): Promise<WardEntity[]> {
    const filter: QueryFilter<WardsSchemaClass> = {
      province_code: provinceId,
    };

    if (normalizedName)
      filter.normalized_name = {
        $regex: `.*${normalizedName}*`,
        $options: 'i',
      };

    const documents = await this._wardsRepository.find(filter).exec();
    return documents.map((document) => WardMapper.toDomain(document));
  }
}
