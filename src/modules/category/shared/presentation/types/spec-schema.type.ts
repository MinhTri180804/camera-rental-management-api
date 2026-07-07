import { FilterType, SpecType } from '../constants';

// ============================================================
// BASE — global field for all specs
// ============================================================
export interface ISpecSchemaBase {
  key: string;
  label: string;
  unit: string | null;
  filterable: boolean;
  compare_enabled: boolean;
  sort_order: number;
}

// ============================================================
// DISCRIMINATED UNION — each spec type has its own shape
// ============================================================

interface ISelectSpec extends ISpecSchemaBase {
  type: Extract<SpecType, 'select'>;
  filter_type: Extract<FilterType, 'checkbox'>;
  options: (string | number)[];
  multiple: boolean;
}

interface IRangeSpec extends ISpecSchemaBase {
  type: Extract<SpecType, 'range'>;
  filter_type: Extract<FilterType, 'range'>;
  min: number;
  max: number;
  step: number;
}

interface IBooleanSpec extends ISpecSchemaBase {
  type: Extract<SpecType, 'boolean'>;
  filter_type: Extract<FilterType, 'toggle'>;
}

interface ITextSpec extends ISpecSchemaBase {
  type: Extract<SpecType, 'text'>;
  options: string[];
}

export type SpecSchema = ISelectSpec | IRangeSpec | IBooleanSpec | ITextSpec;
