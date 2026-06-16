import { MediaStatus, MediaType } from '@modules/media/presentation/constants';

export class MediaEntity {
  id: string;
  publicId: string;
  alt: string;
  type: MediaType;
  folderId: string | null;
  originalName: string;
  displayName: string;
  status: MediaStatus;
  size: number;
  createdBy: string;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
