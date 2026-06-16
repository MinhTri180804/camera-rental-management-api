import { SetMetadata } from '@nestjs/common';

export const ALLOW_EMPTY_BODY_KEY = Symbol('ALLOW_EMPTY_BODY');

export const AllowEmptyBody = () => SetMetadata(ALLOW_EMPTY_BODY_KEY, true);
