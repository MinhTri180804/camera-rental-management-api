import { MediaEntity } from '@modules/media/domain/entities';
import { MediaDocument } from '../schema';
import { Types } from 'mongoose';

export class MediaMapper {
  static toDomain(mediaDocument: MediaDocument): MediaEntity {
    const entity = new MediaEntity();
    entity.id = mediaDocument._id.toString();
    entity.publicId = mediaDocument.public_id;
    entity.alt = mediaDocument.alt;
    entity.type = mediaDocument.type;
    entity.status = mediaDocument.status;
    entity.folderId = mediaDocument.folder_id?.toString() || null;
    entity.originalName = mediaDocument.original_name;
    entity.displayName = mediaDocument.display_name;
    entity.size = mediaDocument.size;
    entity.createdBy = mediaDocument.created_by.toString();
    entity.isDeleted = mediaDocument.is_deleted;
    entity.deletedAt = mediaDocument.deleted_at;
    entity.createdAt = mediaDocument.createdAt;
    entity.updatedAt = mediaDocument.updatedAt;
    return entity;
  }

  static toPersistence(
    mediaEntity: Omit<
      MediaEntity,
      'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleted'
    >,
  ): Partial<MediaDocument> {
    return {
      public_id: mediaEntity.publicId,
      alt: mediaEntity.alt,
      type: mediaEntity.type,
      status: mediaEntity.status,
      folder_id: mediaEntity.folderId
        ? new Types.ObjectId(mediaEntity.folderId)
        : null,
      original_name: mediaEntity.originalName,
      display_name: mediaEntity.displayName,
      size: mediaEntity.size,
      created_by: new Types.ObjectId(mediaEntity.createdBy),
    };
  }
}
