import { Controller, Get, HttpCode, Param, Query } from '@nestjs/common';
import { ListDataResponse, ResponseMessage } from '@shared/presentation';
import {
  GetAllProvincesUseCase,
  GetAllWardsByProvinceUseCase,
} from '../application/use-case';

@Controller('locations')
export class LocationController {
  constructor(
    private readonly getAllProvincesUseCase: GetAllProvincesUseCase,
    private readonly getAllWardsByProvinceUseCase: GetAllWardsByProvinceUseCase,
  ) {}

  @Get('provinces')
  @HttpCode(200)
  @ResponseMessage('Get all provinces successfully')
  async getAllProvinces(@Query('search') search?: string) {
    const provinces = await this.getAllProvincesUseCase.execute({ search });
    return new ListDataResponse({
      data: provinces,
      total: provinces.length,
      page: 1,
      limit: provinces.length,
    });
  }

  @Get('wards/:provinceId')
  @HttpCode(200)
  @ResponseMessage('Get all wards by province successfully')
  async getAllWardsByProvince(
    @Param('provinceId') provinceId: number,
    @Query('search') search?: string,
  ) {
    const wards = await this.getAllWardsByProvinceUseCase.execute({
      provinceId,
      search,
    });

    return new ListDataResponse({
      data: wards,
      total: wards.length,
      page: 1,
      limit: wards.length,
    });
  }
}
