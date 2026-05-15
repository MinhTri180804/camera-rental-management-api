import {
  IsFullNameRecipient,
  IsName,
} from '@modules/delivery-information/presentation/decorators';
import { Type } from 'class-transformer';
import { IsMobilePhone, ValidateNested } from 'class-validator';
import { AddressDTO } from './address.dto';

export class CreateDeliveryInformationDTO {
  @IsName()
  name: string;

  @IsFullNameRecipient()
  fullNameRecipient: string;

  @IsMobilePhone('vi-VN')
  phoneRecipient: string;

  @ValidateNested()
  @Type(() => AddressDTO)
  address: AddressDTO;
}
