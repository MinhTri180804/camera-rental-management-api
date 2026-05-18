import { WardEntity } from '../../entities';

export interface IWardsReader {
  isExist({ code, name }: { code: number; name: string }): Promise<boolean>;
  findByCodeAndProvinceCode({
    code,
    provinceCode,
  }: {
    code: number;
    provinceCode: number;
  }): Promise<WardEntity | null>;
  findByCode(code: number): Promise<WardEntity | null>;
}

export const WARDS_READER = Symbol('WardsReader');
