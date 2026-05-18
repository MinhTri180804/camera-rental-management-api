import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint({ name: 'wardProvinceMatch', async: false })
export class WardProvinceMatchConstraint implements ValidatorConstraintInterface {
  validate(_: any, args: ValidationArguments) {
    const address = args.object as {
      province?: {
        code: number;
        name: string;
        divisionType: string;
      };
      ward?: {
        code: number;
        name: string;
        divisionType: string;
        provinceCode: number;
      };
    };
    const province = address.province;
    const ward = address.ward;

    if (!province?.code || !ward?.provinceCode) return true;

    return ward.provinceCode === province.code;
  }

  defaultMessage() {
    return 'ward.provinceCode must match province.code';
  }
}

export function WardProvinceMatch(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: WardProvinceMatchConstraint,
    });
  };
}
