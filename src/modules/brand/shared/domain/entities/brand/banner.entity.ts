import { MediaType } from '@modules/media/presentation/constants';

export class BannerEntity {
  id: string;
  publicId: string;
  version: number;
  alt: string;
  type: MediaType;
  createdAt: Date;
  updatedAt: Date;
}
