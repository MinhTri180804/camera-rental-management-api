import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
} from '@nestjs/common';
import {
  GetAllBrandUseCase,
  GetBrandBySlugUseCase,
} from '../application/use-case';
import {
  IsPublic,
  ListDataResponse,
  ResponseMessage,
  SingleDataResponse,
} from '@shared/presentation';
import { GetAllQuery } from '../application/query';

@Controller('brands')
export class ClientBrandController {
  constructor(
    private readonly _getAllBrandUseCase: GetAllBrandUseCase,
    private readonly _getBrandBySlugUseCase: GetBrandBySlugUseCase,
  ) {}

  @Get(':slug')
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get brand by slug successfully')
  async getBySlug(@Param('slug') slug: string) {
    const brand = await this._getBrandBySlugUseCase.execute({ slug });
    return new SingleDataResponse(brand);
  }

  @Get()
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all brands successfully')
  async getAll(@Query() query: GetAllQuery) {
    const result = await this._getAllBrandUseCase.execute({
      query,
    });

    return new ListDataResponse({
      data: result.data,
      total: result.total,
      page: result.page,
      limit: result.limit,
    });
  }
}
