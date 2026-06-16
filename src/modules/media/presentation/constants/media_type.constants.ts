export const MEDIA_TYPE = {
  IMAGE: 'image',
  DOCUMENT: 'document',
} as const;

export type MediaType = (typeof MEDIA_TYPE)[keyof typeof MEDIA_TYPE];
