/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  BooleanSpecSchemaDto,
  RangeSpecSchemaDto,
  SelectSpecSchemaDto,
  TextSpecSchemaDto,
} from '@modules/category/shared/application/dto/category/spec-schema.dto';
import { plainToInstance } from 'class-transformer';
import {
  registerDecorator,
  validate,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { SPEC_TYPE } from '../../../constants';

const SPEC_SCHEMA_MAP = {
  [SPEC_TYPE.SELECT]: SelectSpecSchemaDto,
  [SPEC_TYPE.BOOLEAN]: BooleanSpecSchemaDto,
  [SPEC_TYPE.RANGE]: RangeSpecSchemaDto,
  [SPEC_TYPE.TEXT]: TextSpecSchemaDto,
};

@ValidatorConstraint({ async: true })
export class IsValidSpecSchemaConstraint implements ValidatorConstraintInterface {
  private _errorMessages: string[] = [];

  async validate(specs: any[]): Promise<boolean> {
    this._errorMessages = [];
    if (!Array.isArray(specs)) return false;

    for (const [index, spec] of specs.entries()) {
      const dtoClass = SPEC_SCHEMA_MAP[spec?.type];
      if (!dtoClass) {
        this._errorMessages.push(`[${index}]: unknown type "${spec?.type}"`);
        return false;
      }

      const instance = plainToInstance(dtoClass, spec);
      const errors = await validate(instance, {
        whitelist: true,
        forbidNonWhitelisted: false,
      });

      if (errors.length > 0) {
        errors.forEach((e) => {
          const msg = Object.values(e.constraints ?? {}).join(', ');
          this._errorMessages.push(`[${index}].${e.property}: ${msg}`);
        });
        return false;
      }
    }

    return true;
  }

  defaultMessage(): string {
    return (
      this._errorMessages.join(' | ') ||
      'specs_schema contains invalid spec entries'
    );
  }
}

export function IsValidSpecSchema(options?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options,
      constraints: [],
      validator: IsValidSpecSchemaConstraint,
    });
  };
}
