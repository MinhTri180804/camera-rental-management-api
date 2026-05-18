// address-option.dto.ts
import { registerDecorator, ValidationOptions } from 'class-validator';

export function IsNotEmptyAddressOption(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isNotEmptyAddressOption',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: { province?: object; ward?: object; street?: string }) {
          if (!value || typeof value !== 'object') return false;
          return (
            value.province != null ||
            value.ward != null ||
            (typeof value.street === 'string' && value.street.trim().length > 0)
          );
        },
        defaultMessage() {
          return 'address must not be an empty object';
        },
      },
    });
  };
}
