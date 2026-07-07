export interface IMediaReader {
  existsById(id: string): Promise<{ id: string } | null>;
}

export const MEDIA_READER = Symbol('MEDIA_READER');
