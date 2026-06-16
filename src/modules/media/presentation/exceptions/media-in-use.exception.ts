import { MediaUsageResult } from '@modules/media/domain/ports';
import { DomainException } from '@shared/presentation';

export class MediaInUseException extends DomainException {
  static readonly ERROR_CODE = 'MEDIA_IN_USE';
  static readonly DEFAULT_MESSAGE = 'Media is being used and cannot be deleted';

  constructor(
    usages: MediaUsageResult[],
    message = MediaInUseException.DEFAULT_MESSAGE,
  ) {
    super(MediaInUseException.ERROR_CODE, message, { usages });
  }
}
