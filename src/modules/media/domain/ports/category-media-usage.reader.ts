import { MediaUsageReader } from './media-usage.reader';

export abstract class CategoryMediaUsageReaderAbstract extends MediaUsageReader {}

export const CATEGORY_MEDIA_USAGE_READER = Symbol(
  'CATEGORY_MEDIA_USAGE_READER',
);
