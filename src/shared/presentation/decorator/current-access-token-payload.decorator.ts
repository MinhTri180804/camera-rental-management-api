/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtAccessTokenPayload } from '@shared/domain';

/**
 * A custom decorator that retrieves the payload of the current access token
 * from the request object and returns the specified property of the payload.
 *
 * @param {keyof JwtAccessTokenPayload} key - The property of the payload to retrieve.
 * @param {ExecutionContext} ctx - The execution context.
 * @returns {JwtAccessTokenPayload[keyof JwtAccessTokenPayload]} - The value of the specified property in the payload.
 */
export const CurrentAccessTokenPayload = createParamDecorator(
  (key: keyof JwtAccessTokenPayload, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as JwtAccessTokenPayload;
    return user[key];
  },
);
