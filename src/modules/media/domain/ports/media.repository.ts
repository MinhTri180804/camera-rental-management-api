import { MediaEntity } from '../entities';

export interface IMediaRepository {
  create(
    media: Omit<
      MediaEntity,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
    >,
  ): Promise<MediaEntity>;

  softDelete(id: string): Promise<void>;

  getById(id: string): Promise<MediaEntity | null>;

  hardDelete(id: string): Promise<void>;

  setFlagDeleted(id: string): Promise<void>;

  getAllByFolderId(params: {
    folderId: string | null;
    search?: string;
    page: number;
    limit: number;
    sort: string;
    order: string;
  }): Promise<{ data: MediaEntity[]; total: number }>;
}

export const MEDIA_REPOSITORY = Symbol('MEDIA_REPOSITORY');
