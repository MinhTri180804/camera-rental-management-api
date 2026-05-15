import { HttpStatus } from '@nestjs/common';
import { DomainException } from '@shared/presentation';

export class DeliveryInformationNotFoundException extends DomainException {
  static readonly ERROR_CODE = 'DELIVERY_INFORMATION_NOT_FOUND';
  static readonly DEFAULT_MESSAGE = 'Delivery information not found';

  constructor(message = DeliveryInformationNotFoundException.DEFAULT_MESSAGE) {
    super(
      DeliveryInformationNotFoundException.ERROR_CODE,
      message,
      null,
      HttpStatus.NOT_FOUND,
    );
  }
}
