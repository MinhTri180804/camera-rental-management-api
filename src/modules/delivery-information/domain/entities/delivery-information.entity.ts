export class DeliveryInformationEntity {
  id: string;
  userId: string;
  name: string;
  normalizedName: string;
  fullNameRecipient: string;
  phoneRecipient: string;
  address: {
    province: {
      code: number;
      name: string;
      divisionType: string;
    };
    ward: {
      code: number;
      name: string;
      divisionType: string;
    };
    street: string;
  };
  addressTextFull: string;
  createdAt: Date;
  updatedAt: Date;
}
