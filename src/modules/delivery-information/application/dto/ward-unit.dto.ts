import { IsInt, IsString, MaxLength, Min } from 'class-validator';

export class WardUnitDTO {
  @IsInt()
  @Min(1)
  code: number;

  @IsString()
  @MaxLength(100)
  name: string;

  @IsString()
  @MaxLength(50)
  divisionType: string;

  @IsInt()
  @Min(1)
  provinceCode: number;
}
