import { WardEntity } from '../../entities';

export interface IWardsReader {
  isExist({ code, name }: { code: number; name: string }): Promise<boolean>;
  findByCodeAndProvinceCode(
    code: number,
    provinceCode: number,
  ): Promise<WardEntity | null>;
}

export const WARDS_READER = Symbol('WardsReader');
