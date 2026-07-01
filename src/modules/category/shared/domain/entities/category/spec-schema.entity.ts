import {
  FilterType,
  SpecType,
} from '@modules/category/shared/presentation/constants';

export class SpecSchemaBaseEntity {
  key: string;
  label: string;
  unit: string | null;
  filterable: boolean;
  compareEnabled: boolean;
  sortOrder: number;
}

export class SelectSpecSchemaEntity extends SpecSchemaBaseEntity {
  type: Extract<SpecType, 'select'>;
  filterType: Extract<FilterType, 'checkbox'>;
  options: (string | number)[];
  multiple: boolean;
}

export class RangeSpecSchemaEntity extends SpecSchemaBaseEntity {
  type: Extract<SpecType, 'range'>;
  filterType: Extract<FilterType, 'range'>;
  min: number;
  max: number;
  step: number;
}

export class BooleanSpecSchemaEntity extends SpecSchemaBaseEntity {
  type: Extract<SpecType, 'boolean'>;
  filterType: Extract<FilterType, 'toggle'>;
}

export class TextSpecSchemaEntity extends SpecSchemaBaseEntity {
  type: Extract<SpecType, 'text'>;
  options: string[];
}

export type SpecsSchemaEntityTypes = (
  | SelectSpecSchemaEntity
  | RangeSpecSchemaEntity
  | BooleanSpecSchemaEntity
  | TextSpecSchemaEntity
)[];
