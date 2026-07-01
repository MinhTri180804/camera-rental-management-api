import {
  FILTER_TYPE,
  SPEC_TYPE,
} from '@modules/category/shared/presentation/constants';
import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';

class SpecSchemaBaseDto {
  @IsString()
  key: string;

  @IsString()
  label: string;

  @IsOptional()
  @IsString()
  unit: string | null;

  @IsBoolean()
  filterable: boolean;

  @IsBoolean()
  compareEnabled: boolean;

  @IsPositive()
  sortOrder: number;
}

export class SelectSpecSchemaDto extends SpecSchemaBaseDto {
  @IsIn([SPEC_TYPE.SELECT])
  type: 'select';

  filterType: 'checkbox' = FILTER_TYPE.CHECKBOX;

  @IsArray()
  @ArrayNotEmpty()
  options: (string | number)[];

  @IsBoolean()
  multiple: boolean;
}

export class RangeSpecSchemaDto extends SpecSchemaBaseDto {
  @IsIn([SPEC_TYPE.RANGE])
  type: 'range';

  filterType: 'range' = FILTER_TYPE.RANGE;

  @IsNumber()
  min: number;

  @IsNumber()
  max: number;

  @IsNumber()
  step: number;
}

export class BooleanSpecSchemaDto extends SpecSchemaBaseDto {
  @IsIn([SPEC_TYPE.BOOLEAN])
  type: 'boolean';

  filterType: 'toggle' = FILTER_TYPE.TOGGLE;
}

export class TextSpecSchemaDto extends SpecSchemaBaseDto {
  @IsIn([SPEC_TYPE.TEXT])
  type: 'text';

  @IsArray()
  @IsString({ each: true })
  options: string[];
}

export type SpecsSchemaDTOTypes = (
  | SelectSpecSchemaDto
  | RangeSpecSchemaDto
  | BooleanSpecSchemaDto
  | TextSpecSchemaDto
)[];
