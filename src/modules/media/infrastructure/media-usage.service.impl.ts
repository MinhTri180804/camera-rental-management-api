import { Inject, Injectable } from '@nestjs/common';
import {
  IMediaUsageService,
  MediaUsageReader,
  MediaUsageResult,
} from '../domain/ports';

@Injectable()
export class MediaUsageServiceImpl implements IMediaUsageService {
  constructor(
    @Inject(MediaUsageReader)
    private readonly _mediaUsageReader: MediaUsageReader[],
  ) {}

  async findUsage(mediaId: string): Promise<MediaUsageResult[]> {
    const result = await Promise.all(
      this._mediaUsageReader.map((reader) => reader.findByMediaId(mediaId)),
    );

    return result;
  }
}
