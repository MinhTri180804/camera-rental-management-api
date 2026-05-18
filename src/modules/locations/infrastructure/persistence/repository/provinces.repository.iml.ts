import { IProvincesRepository } from '@modules/locations/domain/ports';
import { InjectModel } from '@nestjs/mongoose';
import { ProvincesSchemaClass } from '../schema';
import { Model, QueryFilter } from 'mongoose';
import { ProvinceEntity } from '@modules/locations/domain/entities';
import { ProvinceMapper } from '../mapper';

export class ProvincesRepositoryImpl implements IProvincesRepository {
  constructor(
    @InjectModel(ProvincesSchemaClass.name)
    private readonly provincesModel: Model<ProvincesSchemaClass>,
  ) {}

  async findByNormalizedName(
    normalizedName: string,
  ): Promise<ProvinceEntity[]> {
    const provinces = await this.provincesModel.find({ normalizedName });
    return provinces.map((province) => ProvinceMapper.toDomain(province));
  }

  async isExistByCode(code: number): Promise<boolean> {
    const province = await this.provincesModel.exists({ code });
    return !!province;
  }

  async findAllByNormalizedNames(
    normalizedName?: string,
  ): Promise<ProvinceEntity[]> {
    const filter: QueryFilter<ProvincesSchemaClass> = {};
    if (normalizedName)
      filter.normalized_name = {
        $regex: `.*${normalizedName}*`,
        $options: 'i',
      };
    const provinces = await this.provincesModel.find(filter);

    return provinces.map((province) => ProvinceMapper.toDomain(province));
  }
}
