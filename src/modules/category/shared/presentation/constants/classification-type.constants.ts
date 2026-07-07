export const CLASSIFICATION_TYPE = {
  BRAND: 'brand',
  USECASE: 'usecase',
  COMPATIBILITY: 'compatibility',
  TYPE: 'type',
  GENERAL: 'general',
} as const;

export type ClassificationType =
  (typeof CLASSIFICATION_TYPE)[keyof typeof CLASSIFICATION_TYPE];
