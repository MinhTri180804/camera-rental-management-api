import { MediaFolderEntity } from '../entities';

export interface IMediaFolderRepository {
  create(
    entity: Omit<
      MediaFolderEntity,
      'id' | 'deletedAt' | 'isDeleted' | 'createdAt' | 'updatedAt'
    >,
  ): Promise<MediaFolderEntity>;

  getAll(params: {
    parentId: string | null;
    page: number;
    search?: string;
    limit: number;
    order: string;
    sort: string;
  }): Promise<{ total: number; data: MediaFolderEntity[] }>;

  getById(id: string): Promise<MediaFolderEntity | null>;

  getBySlug(slug: string): Promise<MediaFolderEntity | null>;

  getByPath(path: string): Promise<MediaFolderEntity | null>;
}

export const MEDIA_FOLDER_REPOSITORY = Symbol('MEDIA_FOLDER_REPOSITORY');
