import { MediaUsageReader } from './media-usage.reader';

export abstract class BrandReader extends MediaUsageReader {}

export const BRAND_READER = Symbol('BRAND_READER');
