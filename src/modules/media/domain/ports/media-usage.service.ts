export type MediaUsageResult = {
  collection: string;
  count: number;
  records: {
    id: string;
    fieldsUsage: FieldsUsage[];
  }[];
};

export interface IMediaUsageService {
  findUsage(mediaId: string): Promise<MediaUsageResult[]>;
}

export type FieldsUsage = {
  isArray: boolean;
  fieldName: string;
  indexArray: null | number[];
};

export const MEDIA_USAGE_SERVICE = 'MEDIA_USAGE_SERVICE';
