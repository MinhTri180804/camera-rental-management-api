import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { ProvinceUnitDTO } from './province-unit.dto';
import { WardUnitDTO } from './ward-unit.dto';

export class AddressOptionDTO {
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => ProvinceUnitDTO)
  province?: ProvinceUnitDTO;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => WardUnitDTO)
  ward?: WardUnitDTO;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  street?: string;
}
