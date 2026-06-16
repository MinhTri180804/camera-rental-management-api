/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
// src/common/decorators/parse-metadata.decorator.ts

import {
  createParamDecorator,
  ExecutionContext,
  BadRequestException,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

export const ParseMetadata = <T>(dto: new () => T) =>
  createParamDecorator(async (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const raw = request.body?.metadata;

    if (!raw) throw new BadRequestException('metadata is required');

    try {
      const parsed = plainToInstance(dto, JSON.parse(raw));
      const errors = await validate(parsed as object);
      if (errors.length > 0) throw new BadRequestException(errors);
      return parsed;
    } catch {
      throw new BadRequestException('metadata must be a valid JSON string');
    }
  })();
