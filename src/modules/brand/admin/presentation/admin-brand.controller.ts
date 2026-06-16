import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
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
  ChangeActiveBrandDTO,
  CreateBrandDTO,
  RestoreBrandDTO,
  UpdateBrandDTO,
} from '../application/dto';
import {
  CreateBrandUseCase,
  GetAllBrandUseCase,
  GetBySlugUseCase,
  RestoreBrandUseCase,
  SoftDeleteBrandUseCase,
  ChangeActiveBrandUseCase,
  UpdateBrandUseCase,
} from '../application/use-case';
import { GetAllQuery } from '../application/query';

@Controller('admin/brands')
export class AdminBrandController {
  constructor(
    private readonly _restoreBrandUseCase: RestoreBrandUseCase,
    private readonly _softDeleteBrandUseCase: SoftDeleteBrandUseCase,
    private readonly _createBrandUseCase: CreateBrandUseCase,
    private readonly _getBySlugUseCase: GetBySlugUseCase,
    private readonly _getAllBrandUseCase: GetAllBrandUseCase,
    private readonly _changeActiveBrandUseCase: ChangeActiveBrandUseCase,
    private readonly _updateBrandUseCase: UpdateBrandUseCase,
  ) {}

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResponseMessage('Brand deleted successfully')
  async softDelete(@Param('id') id: string) {
    const brand = await this._softDeleteBrandUseCase.execute({ id });
    return new SingleDataResponse(brand);
  }

  @Patch(':id/restore')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Restore brand successfully')
  async restore(@Param('id') id: string, @Body() dto: RestoreBrandDTO) {
    const brand = await this._restoreBrandUseCase.execute({ id, dto });
    return new SingleDataResponse(brand);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ResponseMessage('Brand created successfully')
  async create(
    @Body() data: CreateBrandDTO,
    @CurrentAccessTokenPayload('sub') userId: string,
  ) {
    const brand = await this._createBrandUseCase.execute({ dto: data, userId });
    return new SingleDataResponse(brand);
  }

  @Get(':slug')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get brand by slug successfully')
  async getBySlug(@Param('slug') slug: string) {
    const brand = await this._getBySlugUseCase.execute({ slug });
    return new SingleDataResponse(brand);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Get all brands successfully')
  async getAll(@Query() query: GetAllQuery) {
    const { total, data, limit, page } = await this._getAllBrandUseCase.execute(
      { query },
    );
    return new ListDataResponse({ data, total, limit, page });
  }

  @Patch(':id/change-active')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Change active brand successfully')
  async changeActive(
    @Param('id') id: string,
    @Body() dto: ChangeActiveBrandDTO,
  ) {
    const brand = await this._changeActiveBrandUseCase.execute({ id, dto });
    return new SingleDataResponse(brand);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ResponseMessage('Update brand successfully')
  async update(@Param('id') id: string, @Body() dto: UpdateBrandDTO) {
    const brand = await this._updateBrandUseCase.execute({ id, dto });
    return new SingleDataResponse(brand);
  }
}
