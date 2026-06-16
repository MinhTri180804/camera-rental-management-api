import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from '@nestjs/common';
import {
  CurrentAccessTokenPayload,
  ListDataResponse,
  ResponseMessage,
  SingleDataResponse,
} from '@shared/presentation';
import {
  CreateMediaFolderUseCase,
  GetAllMediaFolderUseCase,
} from '../application/usecase';
import { GetAllMediaFolderQuery } from '../application/query';
import { CreateMediaFolderDTO } from '../application/dto';

@Controller('media-folders')
export class MediaFolderController {
  constructor(
    private readonly _getAllMediaFolderUseCase: GetAllMediaFolderUseCase,
    private readonly _createMediaFolderUseCase: CreateMediaFolderUseCase,
  ) {}

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all media folder successfully')
  async getAllMediaFolder(@Query() query: GetAllMediaFolderQuery) {
    const { data, total } = await this._getAllMediaFolderUseCase.execute({
      query,
    });

    return new ListDataResponse({
      data,
      total,
      limit: query.limit,
      page: query.page,
    });
  }

  @Post('')
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Create media folder successfully')
  async createMediaFolder(
    @Body() dto: CreateMediaFolderDTO,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    const mediaFolder = await this._createMediaFolderUseCase.execute({
      dto,
      userId,
    });
    return new SingleDataResponse(mediaFolder);
  }
}
