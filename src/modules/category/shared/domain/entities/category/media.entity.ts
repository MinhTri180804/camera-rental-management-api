import { MediaType } from '@modules/media/presentation/constants';

export class MediaEntity {
  id: string;
  publicId: string;
  alt: string;
  type: MediaType;
  createdAt: Date;
  updatedAt: Date;
}
