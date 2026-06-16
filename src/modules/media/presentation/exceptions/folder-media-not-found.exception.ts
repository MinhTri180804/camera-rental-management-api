import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class FolderMediaNotFoundException extends DomainException {
  static readonly DEFAULT_MESSAGE = 'Folder media not found';
  static readonly ERROR_CODE = 'FOLDER_MEDIA_NOT_FOUND';
  constructor(message = FolderMediaNotFoundException.DEFAULT_MESSAGE) {
    super(
      FolderMediaNotFoundException.ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
