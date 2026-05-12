import { ProvinceEntity } from '../entities';

export interface IProvincesRepository {
  findByNormalizedName(normalizedName: string): Promise<ProvinceEntity[]>;
  isExistByCode(code: number): Promise<boolean>;
  findAllByNormalizedNames(normalizedNames?: string): Promise<ProvinceEntity[]>;
}

export const PROVINCES_REPOSITORY = Symbol('PROVINCES_REPOSITORY');
