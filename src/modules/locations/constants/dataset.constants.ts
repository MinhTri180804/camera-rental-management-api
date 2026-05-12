export const DATASET = {
  PRE_MERGE: 'pre_merge',
  POST_MERGE: 'post_merge',
} as const;

export type Dataset = (typeof DATASET)[keyof typeof DATASET];
