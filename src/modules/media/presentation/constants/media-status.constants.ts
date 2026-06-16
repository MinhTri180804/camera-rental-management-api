export const MEDIA_STATUS = {
  ACTIVE: 'active',
  PENDING_DELETE: 'pending_delete',
  DELETED: 'deleted',
} as const;

export type MediaStatus = (typeof MEDIA_STATUS)[keyof typeof MEDIA_STATUS];
