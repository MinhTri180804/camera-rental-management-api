export class MediaFolderEntity {
  id: string;
  name: string;
  slug: string;
  path: string;
  description: string | null;
  parentId: string | null;
  isDeleted: boolean;
  deletedAt: Date | null;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}
