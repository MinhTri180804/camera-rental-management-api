import {
  IsFullNameRecipient,
  IsName,
  IsNotEmptyAddressOption,
} from '@modules/delivery-information/presentation/decorators';
import { Type } from 'class-transformer';
import { IsMobilePhone, IsOptional, ValidateNested } from 'class-validator';
import { AddressOptionDTO } from './address-option.dto';

export class UpdateDeliveryInformationDTO {
  @IsOptional()
  @IsName()
  name?: string;

  @IsOptional()
  @IsFullNameRecipient()
  fullNameRecipient?: string;

  @IsOptional()
  @IsMobilePhone('vi-VN')
  phoneRecipient?: string;

  @IsOptional()
  @ValidateNested()
  @IsNotEmptyAddressOption()
  @Type(() => AddressOptionDTO)
  address?: AddressOptionDTO;
}
