export const DELETE_FILTER = {
  ALL: 'all',
  DELETED: 'deleted',
  NOT_DELETED: 'not_deleted',
} as const;

export type DeleteFilter = (typeof DELETE_FILTER)[keyof typeof DELETE_FILTER];
