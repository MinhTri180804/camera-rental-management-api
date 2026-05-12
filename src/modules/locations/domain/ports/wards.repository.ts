import { WardEntity } from '../entities';

export interface IWardsRepository {
  findByProvinceId(provinceId: number, search?: string): Promise<WardEntity[]>;
}

export const WARDS_REPOSITORY = Symbol('WARDS_REPOSITORY');
