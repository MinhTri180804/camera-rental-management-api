export interface IMediaReader {
  isExistsById(id: string): Promise<boolean>;
}

export const MEDIA_READER = 'MEDIA_READER';
