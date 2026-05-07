import { SetMetadata } from '@nestjs/common';

export const RESPONSE_MESSAGE_METADATA = 'response_success_message';

/**
 * Decorator to set the response message metadata.
 *
 * @param message - The success message for the response.
 * @returns The decorator function.
 */
export const ResponseMessage = (message: string) =>
  SetMetadata(RESPONSE_MESSAGE_METADATA, message);
