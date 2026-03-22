import {
  ClassConstructor,
  ClassTransformOptions,
  plainToInstance,
} from 'class-transformer';
import { validateSync, ValidatorOptions } from 'class-validator';

export function registerEnv<T extends object, Plain>({
  classConstructor,
  plain,
  classTransformerOptions = {
    enableImplicitConversion: true,
  },
  validatorOptions = {
    skipMissingProperties: false,
  },
}: {
  classConstructor: ClassConstructor<T>;
  plain: Plain;
  classTransformerOptions?: ClassTransformOptions;
  validatorOptions?: ValidatorOptions;
}): T {
  const config = plainToInstance(
    classConstructor,
    plain,
    classTransformerOptions,
  );

  const errors = validateSync(config, validatorOptions);
  if (errors.length > 0) {
    throw new Error(`App config validation failed: ${JSON.stringify(errors)}`);
  }
  return config;
}
