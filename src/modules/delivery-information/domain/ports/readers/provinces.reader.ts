import { ProvinceEntity } from '../../entities';

export interface IProvincesReader {
  isExist({ code, name }: { code: number; name: string }): Promise<boolean>;
  findByCode(code: number): Promise<ProvinceEntity | null>;
}

export const PROVINCES_READER = Symbol('ProvincesReader');
