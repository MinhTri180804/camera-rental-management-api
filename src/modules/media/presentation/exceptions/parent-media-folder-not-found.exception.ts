import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class ParentMediaFolderNotFoundException extends DomainException {
  static readonly ERROR_CODE = 'PARENT_MEDIA_FOLDER_NOT_FOUND';
  static readonly DEFAULT_MESSAGE = 'Parent media folder not found';
  constructor(message = ParentMediaFolderNotFoundException.DEFAULT_MESSAGE) {
    super(
      ParentMediaFolderNotFoundException.ERROR_CODE,
      message,
      null,
      HttpStatus.BAD_REQUEST,
    );
  }
}
