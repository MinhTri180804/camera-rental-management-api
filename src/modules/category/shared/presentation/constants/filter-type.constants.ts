export const FILTER_TYPE = {
  SELECT: 'checkbox',
  RANGE: 'range',
  TOGGLE: 'toggle',
  CHECKBOX: 'checkbox',
} as const;

export type FilterType = (typeof FILTER_TYPE)[keyof typeof FILTER_TYPE];
