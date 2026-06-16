import { MediaFolderEntity } from '@modules/media/domain/entities';
import { Types } from 'mongoose';
import { MediaFolderLean } from '../schema';

export class MediaFolderMapper {
  static toDomain(mediaFolderDocument: MediaFolderLean): MediaFolderEntity {
    const entity = new MediaFolderEntity();
    entity.id = mediaFolderDocument._id.toString();
    entity.name = mediaFolderDocument.name;
    entity.slug = mediaFolderDocument.slug;
    entity.path = mediaFolderDocument.path;
    entity.description = mediaFolderDocument.description;
    entity.parentId = mediaFolderDocument.parent_id?.toString() || null;
    entity.isDeleted = mediaFolderDocument.is_deleted;
    entity.deletedAt = mediaFolderDocument.deleted_at;
    entity.createdBy = mediaFolderDocument.created_by.toString();
    entity.createdAt = mediaFolderDocument.createdAt;
    entity.updatedAt = mediaFolderDocument.updatedAt;
    return entity;
  }

  static toPersistence(
    mediaFolderEntity: Omit<
      MediaFolderEntity,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
    >,
  ): Omit<
    MediaFolderLean,
    '_id' | 'createdAt' | 'updatedAt' | 'deleted_at' | 'is_deleted'
  > {
    return {
      name: mediaFolderEntity.name,
      slug: mediaFolderEntity.slug,
      path: mediaFolderEntity.path,
      description: mediaFolderEntity.description,
      parent_id: mediaFolderEntity.parentId
        ? new Types.ObjectId(mediaFolderEntity.parentId)
        : null,
      created_by: new Types.ObjectId(mediaFolderEntity.createdBy),
    };
  }
}
