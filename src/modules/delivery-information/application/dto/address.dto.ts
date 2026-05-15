import { IsString, MaxLength, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { AdministrativeUnitDTO } from './administrative-unit.dto';

export class AddressDTO {
  @ValidateNested()
  @Type(() => AdministrativeUnitDTO)
  province: AdministrativeUnitDTO;

  @ValidateNested()
  @Type(() => AdministrativeUnitDTO)
  ward: AdministrativeUnitDTO;

  @IsString()
  @MaxLength(255)
  street: string;
}
