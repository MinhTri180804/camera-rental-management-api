import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  CurrentAccessTokenPayload,
  ListDataResponse,
  ResponseMessage,
  SingleDataResponse,
} from '@shared/presentation';
import { ImageMetadataDTO } from '../application/dto';
import { GetAllMediaQuery } from '../application/query';
import {
  DeleteImageMediaUseCase,
  GetAllMediaUseCase,
  UploadImageMediaUseCase,
} from '../application/usecase';
import { ParseMetadata } from './decorators/params';

@Controller('media')
export class MediaController {
  constructor(
    private readonly _uploadImageUseCase: UploadImageMediaUseCase,
    private readonly _deleteImageUseCase: DeleteImageMediaUseCase,
    private readonly _getAllMediaUseCase: GetAllMediaUseCase,
  ) {}

  @Post('image/upload')
  @UseInterceptors(FileInterceptor('image'))
  async uploadImage(
    @CurrentAccessTokenPayload('sub') userId: string,
    @UploadedFile() image: Express.Multer.File,
    @ParseMetadata(ImageMetadataDTO) metadata: ImageMetadataDTO,
  ) {
    const media = await this._uploadImageUseCase.execute({
      image,
      metadata,
      userId,
    });

    return new SingleDataResponse(media);
  }

  @Delete('image/:id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Delete image media successfully')
  async deleteImage(@Param('id') id: string) {
    await this._deleteImageUseCase.execute({ id });
    return new SingleDataResponse(null);
  }

  @Get('')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all media by folder successfully')
  async getAllMediaByFolder(@Query() query: GetAllMediaQuery) {
    const { data, total } = await this._getAllMediaUseCase.execute({
      query,
    });

    return new ListDataResponse({
      data,
      total,
      limit: query.limit,
      page: query.page,
    });
  }

  // TODO: Implement api webhook from cloudinary
}
