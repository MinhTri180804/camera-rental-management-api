import { Types } from 'mongoose';
import { FieldsUsage, MediaUsageResult } from './media-usage.service';

export abstract class MediaUsageReader {
  abstract findByMediaId(mediaId: string): Promise<MediaUsageResult>;

  protected resolveFieldUsages(
    record: Record<string, Types.ObjectId | Types.ObjectId[]>,
    fields: string[],
    mediaId: string,
  ): FieldsUsage[] {
    const fieldsUsage: FieldsUsage[] = [];
    for (const [field, value] of Object.entries(record)) {
      if (!fields.includes(field)) continue;

      if (Array.isArray(value)) {
        const indexList: number[] = [];
        const valuesMatches = value.filter((item, index) => {
          if (item.toString() === mediaId) {
            indexList.push(index);
            return true;
          }
        });
        if (valuesMatches.length > 0) {
          fieldsUsage.push({
            isArray: true,
            fieldName: field,
            indexArray: indexList,
          });
        }
      }

      if (value instanceof Types.ObjectId && value.toString() === mediaId) {
        fieldsUsage.push({
          isArray: false,
          fieldName: field,
          indexArray: null,
        });
      }
    }

    return fieldsUsage;
  }
}
