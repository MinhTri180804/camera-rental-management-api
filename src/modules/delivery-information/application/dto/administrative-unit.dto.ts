import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class AdministrativeUnitDTO {
  @IsInt()
  @Min(1)
  code: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(50)
  divisionType: string;
}
