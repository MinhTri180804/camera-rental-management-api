import { Type } from 'class-transformer';
import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { ProvinceUnitDTO } from './province-unit.dto';
import { WardUnitDTO } from './ward-unit.dto';
import { WardProvinceMatch } from '@modules/delivery-information/presentation/validate';

export class AddressDTO {
  @ValidateNested()
  @Type(() => ProvinceUnitDTO)
  province: ProvinceUnitDTO;

  @ValidateNested()
  @Type(() => WardUnitDTO)
  @WardProvinceMatch()
  ward: WardUnitDTO;

  @IsString()
  @MaxLength(255)
  street: string;
}
