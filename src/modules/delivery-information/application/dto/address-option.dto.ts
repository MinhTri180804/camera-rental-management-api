import { Type } from 'class-transformer';
import {
  IsNotEmptyObject,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from 'class-validator';
import { AdministrativeUnitDTO } from './administrative-unit.dto';

export class AddressOptionDTO {
  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AdministrativeUnitDTO)
  province: AdministrativeUnitDTO;

  @IsOptional()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => AdministrativeUnitDTO)
  ward: AdministrativeUnitDTO;

  @IsOptional()
  @IsString()
  @MaxLength(255)
  street: string;
}
