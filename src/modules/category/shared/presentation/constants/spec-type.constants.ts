export const SPEC_TYPE = {
  SELECT: 'select',
  RANGE: 'range',
  TEXT: 'text',
  BOOLEAN: 'boolean',
} as const;

export type SpecType = (typeof SPEC_TYPE)[keyof typeof SPEC_TYPE];
