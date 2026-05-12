import { normalizedName } from '@common/utils';
import {
  type IWardsRepository,
  WARDS_REPOSITORY,
} from '@modules/locations/domain/ports';
import { Inject, Injectable } from '@nestjs/common';

type ExecuteParams = {
  provinceId: number;
  search?: string;
};

@Injectable()
export class GetAllWardsByProvinceUseCase {
  constructor(
    @Inject(WARDS_REPOSITORY)
    private readonly wardsRepository: IWardsRepository,
  ) {}

  async execute({ provinceId, search }: ExecuteParams) {
    const searchValue = search ? normalizedName(search) : undefined;
    return this.wardsRepository.findByProvinceId(provinceId, searchValue);
  }
}
