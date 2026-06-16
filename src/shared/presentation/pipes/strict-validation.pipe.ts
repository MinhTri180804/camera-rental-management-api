/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { ArgumentMetadata, ValidationPipe } from '@nestjs/common';
import { ValidationError } from 'class-validator';
import { ValidationRequestException } from '../exceptions/validation.exception';
import { cleanObject } from '@common/utils/clean-object.util';
import { RequestBodyEmptyException } from '../exceptions';
import { Reflector } from '@nestjs/core';
import { ALLOW_EMPTY_BODY_KEY, KEEP_NULL_FIELDS_KEY } from '../decorator';

function flattenValidationErrors(
  errors: ValidationError[],
  parentField = '',
): { field: string; message: string[] }[] {
  const result: { field: string; message: string[] }[] = [];

  for (const error of errors) {
    const field = parentField
      ? `${parentField}.${error.property}`
      : error.property;

    if (error.constraints) {
      result.push({
        field,
        message: Object.values(error.constraints),
      });
    }

    if (error.children?.length) {
      result.push(...flattenValidationErrors(error.children, field));
    }
  }

  return result;
}

export class StrictValidationPipe extends ValidationPipe {
  constructor(private readonly _reflector: Reflector) {
    super({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      exceptionFactory: (errors) => {
        const detailsError = flattenValidationErrors(errors);
        return new ValidationRequestException(detailsError);
      },
    });
  }

  async transform(value: object, metadata: ArgumentMetadata) {
    const transformed = (await super.transform(value, metadata)) as object;
    if (
      !transformed ||
      typeof transformed !== 'object' ||
      Array.isArray(transformed)
    )
      return transformed as unknown[];

    const keepNullFields: string[] = metadata.metatype
      ? (Reflect.getMetadata(KEEP_NULL_FIELDS_KEY, metadata.metatype) ?? [])
      : [];

    const transformClean = cleanObject({
      object: transformed,
      keepNullFields,
    });

    const allowEmptyBody = metadata.metatype
      ? Reflect.getMetadata(ALLOW_EMPTY_BODY_KEY, metadata.metatype)
      : false;

    if (Object.keys(transformClean).length === 0 && !allowEmptyBody) {
      throw new RequestBodyEmptyException('Request body cannot be empty');
    }

    console.log('transformed', transformed);

    return transformed;
  }
}
